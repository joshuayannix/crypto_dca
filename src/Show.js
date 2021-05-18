import React, { useEffect} from 'react';
import PurchaseInstance from './PurchaseInstance';
import { useLocation } from 'react-router-dom';
import queryString from "query-string";

function Show( {} ) {

  const getCoinData = () => {
    console.log('get coindata!')
  }

  let location = useLocation();

  useEffect(() => {
    
    const params = queryString.parse(location.search);
    console.log(params)

    
  })


  // const apiAxios = async (crypto, startDate, endDate) => {
  //   const startDateUnix = new Date(startDate).getTime() / 1000;
  //   const endDateUnix = new Date(endDate).getTime() / 1000;;    

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