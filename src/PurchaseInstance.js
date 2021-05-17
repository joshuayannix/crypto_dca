import React from 'react';

const PurchaseInstance = ({ dollarAmountInvested, coinAmount, coinValue, date }) => {

  return (
    <div>
      You bought crypto!
      {dollarAmountInvested}, {coinAmount}, {coinValue}, {date}
    </div>
  )
}

export default PurchaseInstance

