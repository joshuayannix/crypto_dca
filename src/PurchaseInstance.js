import React from 'react';
//import dayjs from "dayjs";

const PurchaseInstance = ({ dollarAmountInvested, coinAmount, coinValue, date }) => {
  
  return (
    <div>
      dollar amount invested:{dollarAmountInvested}, coinAmount: {coinAmount}, Crypto Purchase price: {coinValue}, date of purchase: {new Date(date).toLocaleDateString('en-US')}
    </div>
  )
}

export default PurchaseInstance

