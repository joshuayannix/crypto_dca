//Sub components and helper files
import React, { useEffect, useState } from 'react';
import PurchaseInstance from './PurchaseInstance';
import { _validateAmount, _validateFrequency, _validateStartDate, _validateEndDate, _validateCoinType, _validateDatesOverlap } from './validations';

// External libraries
import { useHistory, useLocation } from 'react-router-dom';
import queryString from "query-string";
import axios from 'axios';
import dayjs from "dayjs";

function Show() {

  // Router Hooks
  let location = useLocation();
  let history = useHistory();

  // State  
  const [params, setParams] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false)
  const [coinData, setCoinData] = useState([]);

  useEffect(() => {
    const params = queryString.parse(location.search);    
    console.log('useEffect')
    validateValues(params)
  }, [])

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
      setError(error)
      return;
    }
    
    setParams(params)
    //setLoading(true)
    console.log('params updated in state: ',params)
    getCoinData(start, end, coinType)
  }

  const getCoinData = async(startDate, endDate, coinType) => {
    const startDateUnix = dayjs(startDate).unix()
    const endDateUnix = dayjs(endDate).unix()

    console.log('startDate:', startDate)
    console.log('startDateUnix: ',startDateUnix)

    const range = `range?vs_currency=usd&from=${startDateUnix}&to=${endDateUnix}`;
    const url = `https://api.coingecko.com/api/v3/coins/${coinType}/market_chart/${range}`;
    console.log(url)
    try {
      const res = await axios.get(url)
      console.log(res.data)
    } catch(error) {

    }

    // const coinResponse = await fetch(url)
    // console.log(coinResponse)
    // if(coinResponse) {
    //   const apiCoinData = await coinResponse.json();
    //   console.log('api successful: ', apiCoinData)
    //   setCoinData(apiCoinData)
    // }
  }


  // const apiAxios = async (crypto, startDate, endDate) => {


  // const startDateUnix = new Date(startDate).getTime() / 1000;
  //   const endDateUnix = new Date(endDate).getTime() / 1000;
  //   try {
  //     const res = await axios.get(
  //       `https://api.coingecko.com/api/v3/coins/${crypto}/market_chart/range?vs_currency=usd&from=${startDateUnix}&to=${endDateUnix}`
  //     )
  //     let prices = res.data.prices
      

  //     let newData = []
  //     let coinAmount = 0;
  //     let dollarAmountInvested = 0;

  //     /* One month is 24 hrs * 30 days = 722 prices
  //     */
  //     for(let i=0; i<prices.length; i+=722) {
  //       dollarAmountInvested += amount;
  //       coinAmount += amount/prices[i][1];

  //       newData.push({
  //         dollarAmountInvested,
  //         coinAmount,
  //         coinValue: prices[i][1],
  //         date: prices[i][0]
  //       })
  //     }

  //     setDataArr(newData)
  //     setApiPrices(prices)
  //     console.log(dataArr)

  //   } catch (error) {
  //     console.log('error from apiAxios', error)
  //   }    
  // }

  return (
    <div>
      <h3>Show component</h3>

      <div>
        
      </div>
      
    </div>
  )
}

export default Show