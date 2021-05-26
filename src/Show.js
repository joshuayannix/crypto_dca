//Sub components and helper files
import React, { useEffect, useState } from 'react';
import { _validateAmount, _validateFrequency, _validateStartDate, _validateEndDate, } from './validations';
import './Show.css';
import blank from './blank.gif'

// External libraries
import { useHistory } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import queryString from "query-string";
import axios from 'axios';
import dayjs from "dayjs";
import * as ReactBootStrap from 'react-bootstrap';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

function Show() {
  // Router Hooks
  let location = useLocation();
  const history = useHistory();
  // State  
  const [params, setParams] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiCoin, setApiCoin] = useState()
  //const [error, setError] = useState(false)
  const [coinData, setCoinData] = useState([]);
  const [priceToday, setPriceToday] = useState('999');

  let today = new Date()
  let formattedToday = dayjs(today).format('DD-MM-YYYY');

  useEffect(() => {
    const params = queryString.parse(location.search);        
    //console.log('params from Show.js: ', params);
    const validateValues = (params) => {
      const { amount, end, start, freq, coinType } = params;
      let error = null;
      let startDate = dayjs(start);      
      let endDate = dayjs(end);
  
      error = _validateAmount(amount) || error;
      error = _validateFrequency(freq) || error;
      error = _validateStartDate(startDate) || error;
      error = _validateEndDate(endDate) || error;
      //error = _validateDatesOverlap(duration) || error;
  
      if(error && error.length > 0) {
        //setError(error)
        return;
      }
      
      setParams(params)
      setLoading(true)
      //console.log('params updated in state: ',params)
      getCoinData(start, end, coinType)
    }


    validateValues(params)
  }, [])

  const getCoinData = async(startDate, endDate, coinType) => {

    // Construct the url string for the prices between dates
    const startDateUnix = dayjs(startDate).unix()
    const endDateUnix = dayjs(endDate).unix()
    const range = `range?vs_currency=usd&from=${startDateUnix}&to=${endDateUnix}`;
    const url = `https://api.coingecko.com/api/v3/coins/${coinType}/market_chart/${range}`;
    console.log('url:',url)

    // Construct the url string for the price as of Today
    const urlToday = `https://api.coingecko.com/api/v3/coins/${coinType}/history?date=${formattedToday}&localization=false`
    console.log('urlToday: ', urlToday)

    try {
      const response = await axios.get(url)
      setCoinData(response.data.prices)
      console.log('made first api call from url')

      const responseToday = await axios.get(urlToday)
      console.log('responseToday: ', responseToday)
      let responsePriceToday = responseToday.data.market_data.current_price.usd
      console.log('second api call completed for todays price: ', responsePriceToday);
      setPriceToday(responsePriceToday)

      setApiCoin(responseToday.data)

      initializeData();
    } catch(error) {
      console.log('Error from apiAxios', error)
    }
  }

  const initializeData = () => {
    // set other states
    //console.log('newData:',newData)
    setLoading(false)
    
  }
       
  if(loading) {
    return (
      <div>LOADING!</div>
    )
  }

  const backHome = () => {
    history.push({
      pathname:'/'
    })
  }
  /******** Data Calculations *******/

  const filteredData = [];
  let coinAmount = 0;
  let dollarAmountInvested = 0;

  /* If we are receiving hourly data from API (if time between dates is less than 90 days), then we need this for loop to cut the list of prices we get by 24 so we get closer to daily data. Need to calculate the duration to know whether we'll be receiving hourly or daily.
  */

  const getDuration = (a, b) => {
    let dayjsA = dayjs(a)
    let dayjsB = dayjs(b)
    let difference = dayjsB.diff(dayjsA, 'days')
    return difference
  }

  let duration = getDuration(params.start, params.end)
  let hourlyAdjust = 1;
  if(duration < 90) hourlyAdjust = 24;

  for(let i=0; i<coinData.length; i+=params.freq*hourlyAdjust) {
    dollarAmountInvested += Number(params.amount);
    let coinsPurchased = params.amount/coinData[i][1];
    coinAmount += coinsPurchased;
    let fiat = params.amount
    filteredData.push({
      fiat,
      dollarAmountInvested,
      coinAmount,
      coinsPurchased,
      purchasePrice: coinData[i][1],
      date: coinData[i][0]
    })
  }

  let purchasePriceTotals = 0
  for(let i=0; i<filteredData.length; i++) {
    purchasePriceTotals += filteredData[i].purchasePrice;
  }
  let averagePurchasePrice = purchasePriceTotals/filteredData.length;
  let totalCoins = 0
  let totalDollarsInvested = 0
  let profit = 0
  let lumpSumCoins = 0
  let lumpSumValue = 0;
  let lumpSumProfit = 0;

  if(filteredData.length > 0) {
    totalCoins = filteredData[filteredData.length-1].coinAmount
    totalDollarsInvested = filteredData[filteredData.length-1].dollarAmountInvested
    profit = ((priceToday*totalCoins) - totalDollarsInvested).toFixed(2);
    lumpSumCoins = totalDollarsInvested/filteredData[0].purchasePrice
    
  }

  if(lumpSumCoins > 0) {
    lumpSumValue = lumpSumCoins * priceToday
    lumpSumProfit = (lumpSumValue - totalDollarsInvested).toFixed(2)
  }

  //console.log('testing josh: ', apiCoin.image, apiCoin.name);

  const renderPurchase = (purchase, index) => {
    return (
      <tr key={index}>
        <td>{new Date(purchase.date).toLocaleDateString('en-US')}</td>
        <td>${purchase.fiat}</td>
        <td>${purchase.dollarAmountInvested}</td>
        <td>${(purchase.purchasePrice).toFixed(2)}</td>
        <td>{(purchase.coinsPurchased.toFixed(4))}</td>
        <td>{(purchase.coinAmount).toFixed(2)}</td>
      </tr>
    )
  }


  return (
    <div className='show_js'>
      <section className='above_table'>

      
      <div className='header'>
        <button className='back_button' onClick={backHome}>
          <ArrowBackIosIcon/>
          Back to Home
        </button>
        <h3>Your {apiCoin ? apiCoin.name : ''} Investment Summary</h3>
        <img className ='coin_image' src={apiCoin ? apiCoin.image.small : blank}/>
      </div>

      <div className='all_results'>
        <div className='lump_sum'>
          <p>
            You invested ${totalDollarsInvested} and acquired {totalCoins.toFixed(2)} {apiCoin ? apiCoin.name : ''} over a {duration} day period, from {new Date(params.start).toLocaleDateString('en-US')} to {new Date(params.end).toLocaleDateString('en-US')}, over {filteredData.length} investments, at an average price of ${(averagePurchasePrice).toFixed(2)}
          </p>
          <p>
            Current price of {apiCoin ? apiCoin.name : ''} as of today, {today.toLocaleDateString('en-US')}: ${(priceToday *1).toFixed(2)} Current value of your {apiCoin ? apiCoin.name : ''}: ${(priceToday * totalCoins).toFixed(2)}
          </p>
          <p>
            Profit: ${profit} ROI: {((profit/totalDollarsInvested)*100).toFixed(2)}%
          </p>
        </div>

        <div className='lump_sum1'>
          <p>
            However, if you had just invested the ${totalDollarsInvested} as a lump sum on {new Date(params.start).toLocaleDateString('en-US')}, you would have acquired {lumpSumCoins.toFixed(2)} total {apiCoin ? apiCoin.name : ''}, which as of today would be worth ${lumpSumValue.toFixed(2)}. Your profit would've been ${lumpSumProfit}. ROI would've been {((lumpSumProfit/totalDollarsInvested)*100).toFixed(2)}%
          </p>
        </div>
      </div>



      </section>

      <div className='table_title'>
        <h3>Table of Purchases: {apiCoin ? apiCoin.name : ''}</h3>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="download-table-xls-button"
          table="table-to-xls"
          filename="crypto_DCA_purchases"
          sheet="Sheet1"
          buttonText="Download as XLS file"
          
        />        
      </div>
      
      <div className='table_results'>

        <ReactBootStrap.Table striped bordered hover responsive id="table-to-xls">
          <thead>
            <tr>
              <th>Purchase Date</th>
              <th>Dollars Invested</th>
              <th>Total Dollars Invested</th>
              <th>Purchase Price</th>
              <th>Amount of {apiCoin ? apiCoin.name : ''} purchased on this date</th>
              <th>Total {apiCoin ? apiCoin.name : ''} Accumulated</th>
            </tr>    
          </thead>

          <tbody>
            {filteredData.map(renderPurchase)}
          </tbody>
        </ReactBootStrap.Table>

      </div>
  
    </div>
  )
}

export default Show;