import React, { useEffect, useState } from 'react';
import PurchaseInstance from './PurchaseInstance';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from "query-string";
import { _validateAmount, _validateFrequency, _validateStartDate, _validateEndDate, _validateCoinType, _validateDatesOverlap } from './validations';
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
    //getCoinData(start, end, coinType)
  }

  const getCoinData = async(params) => {
    const { amount, end, start, freq, coinType } = params;

    const startDateUnix = new Date(start).getTime() / 1000;
    const endDateUnix = new Date(end).getTime() / 1000;
    const range = `range?vs_currency=usd&from=${startDateUnix}&to=${endDateUnix}`;
    const url = `https://api.coingecko.com/api/v3/coins/${coinType}/market_chart/${range}`;

    const coinResponse = await fetch(url)
    if(coinResponse) {
      const apiCoinData = await coinResponse.json();
      setCoinData(apiCoinData)
      //console.log('api successful: ', apiCoinData)
    }
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