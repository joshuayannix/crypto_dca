//Sub components and helper files
import React, { useEffect, useState } from 'react';
import { _validateAmount, _validateFrequency, _validateStartDate, _validateEndDate, } from './validations';
import './Show.css';
import blank from './blank.gif'

// axios instance to post api request to backend
import axiosInstance from './axios';

// External libraries
import { useHistory, Link, useLocation } from "react-router-dom";
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

  //Tabs
  const [toggleState, setToggleState] = useState(1);
  const toggleTab = (index) => {
    setToggleState(index);
  };

  // MongoDB Send new saved search
  const sendMessage = async (e) => {    
    console.log('sending message to mongodb')

    await axiosInstance.post('/messages/new', {
        amount: params.amount,
        cointype: params.coinType,
        freq: params.freq,
        start: params.start,
        end: params.end,
        searchquery: location.search,
        timestamp: "test timestamp",
        coinimageurl: apiCoin.image.small,
        user: "Josh Yannix",        
    });
  };

  useEffect(() => {
    const params = queryString.parse(location.search);        
    console.log('location from Show.js: ', location.search);
    console.log('params: ', params)
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
      console.log('params updated in state: ',params)
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
      <section className="section loading">
        <h1>Loading...</h1>
      </section>
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

  const commas = (num) => new Intl.NumberFormat('en-US').format(num)
  

  return (
    <div className='show_js'>
      <section className='above_table'>

      
      <div className='header'>
        <button className='back_button' onClick={backHome}>
          <ArrowBackIosIcon/>
          Back to Home
        </button>
        <h3>Your {apiCoin ? apiCoin.name : ''} Investment Results</h3>
        <img className ='coin_image' src={apiCoin ? apiCoin.image.small : blank}/>
        <button onClick={sendMessage}>
          Save this Search
        </button>
        <Link to='/savedsearches'>Saved Searches</Link>
      </div>

      <div className="bloc-tabs">
        <button
          className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(1)}
        >
          Summary
        </button>
        <button
          className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(2)}
        >
          Lump Sum
        </button>
        
      </div>

      <div className="content-tabs">

        <div className={toggleState === 1 ? "content  active-content" : "content"}>
          <div className='summary_tab'>
            <div>From {new Date(params.start).toLocaleDateString('en-US')} to {new Date(params.end).toLocaleDateString('en-US')}, over a {duration} day period,  over {filteredData.length} investments,
            </div>
            <div>You invested <strong>${commas(totalDollarsInvested)}</strong> and acquired <strong>{totalCoins.toFixed(2)} {apiCoin ? apiCoin.name : ''}</strong>  
            </div>
            <div>at an average price of <strong>${(averagePurchasePrice).toFixed(2)}</strong></div>
            <div>Current price of {apiCoin ? apiCoin.name : ''} as of today, {today.toLocaleDateString('en-US')}: <strong>${(priceToday *1).toFixed(2)}</strong></div>
            <div>Your <strong>{totalCoins.toFixed(2)} {apiCoin ? apiCoin.name : ''}</strong> is currently worth <strong>${(commas(priceToday * totalCoins))}</strong></div>
            <div>Your <strong>profit</strong>:{' '}
            {profit < 0 ? (
              <strong className='red' >${commas(profit)}</strong>
            ) : (
              <strong className='green' >${commas(profit)}</strong>
            )}, with an <strong>ROI</strong> of {' '}
            {profit < 0 ? (
              <strong className='red' >{((profit/totalDollarsInvested)*100).toFixed(2)}%</strong>
            ) : (
              <strong className='green' >{((profit/totalDollarsInvested)*100).toFixed(2)}%</strong>
            )}
            </div>
          </div>
        </div>

        <div className={toggleState === 2 ? "content  active-content" : "content"}>
          <div className='lump_sum_tab'>
            <div> However, if you had instead invested the <strong>${commas(totalDollarsInvested)}</strong> as a lump sum on {new Date(params.start).toLocaleDateString('en-US')}, </div>
            <div>You would have acquired <strong>{lumpSumCoins.toFixed(2)}</strong> total <strong>{apiCoin ? apiCoin.name : ''}</strong></div>
            <div>which as of today would be worth <strong>${commas(lumpSumValue)}</strong></div>
            <div>Your <strong>profit</strong>: {' '}
            {profit < 0 ? (
              <strong className='red' >${commas(lumpSumProfit)}</strong>
            ) : (
              <strong className='green' >${commas(lumpSumProfit)}</strong>
            )}, with an <strong>ROI</strong> of {' '} 
            {profit < 0 ? (
              <strong className='red' >{((lumpSumProfit/totalDollarsInvested)*100).toFixed(2)}%</strong>
            ) : (
              <strong className='green' >{((lumpSumProfit/totalDollarsInvested)*100).toFixed(2)}%</strong>
            )}
   </div>
          </div>
        </div>
      </div>



      </section>

      <div className='table_title'>
        <h3>Table of Your {apiCoin ? apiCoin.name : ''} Purchases: </h3>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="download-table-xls-button"
          table="table-to-xls"
          filename={apiCoin ? apiCoin.name +'_dca': ''}
          sheet="Sheet1"
          buttonText="Download Spreadsheet"
          
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