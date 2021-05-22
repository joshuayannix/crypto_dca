//Sub components and helper files
import React, { useEffect, useState } from 'react';
//import PurchaseInstance from './PurchaseInstance';
import { _validateAmount, _validateFrequency, _validateStartDate, _validateEndDate, } from './validations';

// External libraries
import { useLocation } from 'react-router-dom';
import queryString from "query-string";
import axios from 'axios';
import dayjs from "dayjs";
import * as ReactBootStrap from 'react-bootstrap';

function Show() {

  // Router Hooks
  let location = useLocation();

  // State  
  const [params, setParams] = useState({});
  const [loading, setLoading] = useState(false);
  //const [error, setError] = useState(false)
  const [coinData, setCoinData] = useState([]);

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
      //error = _validateCoinType(coinType) || error;
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
    const startDateUnix = dayjs(startDate).unix()
    const endDateUnix = dayjs(endDate).unix()

    const range = `range?vs_currency=usd&from=${startDateUnix}&to=${endDateUnix}`;
    const url = `https://api.coingecko.com/api/v3/coins/${coinType}/market_chart/${range}`;
    console.log('url:',url)
    try {
      const response = await axios.get(url)
      setCoinData(response.data.prices)
      console.log('coinData after api call and setCoinData:', coinData);
      initializeData()
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

let averagePurchasePrice = purchasePriceTotals/filteredData.length



  console.log('filteredData: ',filteredData)

  const renderPurchase = (purchase, index) => {
    return (
      <tr key={index}>
                <td>{new Date(purchase.date).toLocaleDateString('en-US')}</td>

        <td>${purchase.fiat}</td>
        <td>${purchase.dollarAmountInvested}</td>
        <td>${purchase.purchasePrice}</td>
        <td>{purchase.coinsPurchased}</td>
        <td>{purchase.coinAmount}</td>
      </tr>
    )
  }

  //let capitalCrypto = params.coinType.charAt(0).toUpperCase()+params.coinType.slice(1)
  // f


  return (
    <div>

      <h3>Your {'PLACEHOLDER'} Investment Summary</h3>
      <p>You invested ${'filteredData[filteredData.length-1].dollarAmountInvested'} and acquired {'filteredData[filteredData.length-1].coinAmount'} {'PLACEHOLDER'} over a {duration} day period, from {new Date(params.start).toLocaleDateString('en-US')} to {new Date(params.end).toLocaleDateString('en-US')}, over {filteredData.length} investments, at an average price of ${averagePurchasePrice}</p>
      <p>Current price of  {'PLACEHOLDER'} as of today, 5/26/2021: </p>
      <p>Current value of your {'PLACEHOLDER'}</p>
      <p>Profit (current value of your bitcoin - total invested): $450. ROI: profit/current value of your bitcoin</p>

      <div>
        <h3>Table of Purchases: {'PLACEHOLDER'}</h3>
        <ReactBootStrap.Table striped bordered hover responsive>
          <thead>
            <tr>
            <th>Purchase Date</th>

              <th>dollars invested</th>
              <th>Total dollars invested</th>
              <th>Purchase Price</th>
              <th>Coins Purchased on this date</th>
              <th>Total Coins Accumulated</th>
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

export default Show