//Sub components and helper files
import React, { useEffect, useState } from 'react';
import PurchaseInstance from './PurchaseInstance';
import { _validateAmount, _validateFrequency, _validateStartDate, _validateEndDate, } from './validations';

// External libraries
import { useLocation } from 'react-router-dom';
import queryString from "query-string";
import axios from 'axios';
import dayjs from "dayjs";

function Show() {

  // Router Hooks
  let location = useLocation();

  // State  
  const [params, setParams] = useState({});
  const [loading, setLoading] = useState(false);
  //const [error, setError] = useState(false)
  const [coinData, setCoinData] = useState([]);
  const [dataArr, setDataArr] = useState([]);

  useEffect(() => {
    const params = queryString.parse(location.search);    
    console.log('useEffect triggered from Show.js')

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
      console.log('api response:',response.data)
      setCoinData(response.data.prices)
      
      console.log('coinData after api call and setCoinData:', coinData);
      setLoading(true);
      initializeData()
    } catch(error) {
      console.log('Error from apiAxios', error)
    }
  }

  const initializeData = () => {
    let newData = []
    let coinAmount = 0;
    let dollarAmountInvested = 0;

    //One month is 24 hrs * 30 days = 722 prices
    for(let i=0; i<coinData.length; i+=722) {
      dollarAmountInvested += Number(params.amount);
      coinAmount += params.amount/coinData[i][1];

      newData.push({
        dollarAmountInvested,
        coinAmount,
        coinValue: coinData[i][1],
        date: coinData[i][0]
      })
    }

    setDataArr(newData)
    // set other states
    //console.log('newData:',newData)
    setLoading(false)
    
  }
       
  if(loading) {
    return (
      <div>LOADING!</div>
    )
  }
  let coinDataFromState = coinData
  console.log('coinDataFromState', coinDataFromState)
  let dataArrFromState = dataArr
  console.log('dataArrFromState',dataArrFromState)

  const filteredData = [];
  let coinAmount = 0;
  let dollarAmountInvested = 0;

  for(let i=0; i<coinData.length; i+=722) {
      dollarAmountInvested += Number(params.amount);
      coinAmount += params.amount/coinData[i][1];

      filteredData.push({
        dollarAmountInvested,
        coinAmount,
        coinValue: coinData[i][1],
        date: coinData[i][0]
      })
  }

  console.log('filteredData: ', filteredData)


  return (
    <div>
      <h3>Show component</h3>
      <div>coinDataFromState.length:{coinDataFromState.length}</div>
      <div>dataArrFromState.length: {dataArrFromState.length}</div>
      <div>filteredData.length: {filteredData.length}</div>
      <div>
        <h3>PurchaseInstance components from filteredData</h3>
        {filteredData.map(el => {
          return (
            <PurchaseInstance 
              coinAmount={el.coinAmount}
              coinValue={el.coinValue}
              date={el.date}
              dollarAmountInvested={el.dollarAmountInvested}
            />
          )
          
        })}
      </div>

      

      

    

    </div>
  )
}

export default Show