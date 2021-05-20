import React from 'react';

const PurchaseInstance = ({ dollarAmountInvested, coinAmount, coinValue, date }) => {

  return (
    <div>
      Individual Purchase Instance!
      {dollarAmountInvested}, {coinAmount}, {coinValue}, {date}
    </div>
  )
}

export default PurchaseInstance

