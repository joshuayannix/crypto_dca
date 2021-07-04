import React, { useState } from 'react';
import { Modal } from '@material-ui/core';
import './Coin.css';
import dayjs from "dayjs";

const Coin = ({
  id,
  name,
  price,
  symbol,
  marketcap,
  volume,
  image,
  priceChange,
  handler,
  ath,
  ath_change_percentage,
  ath_date,
  high_24h,
  low_24h,
  max_supply,
  price_change_24h,
  market_cap_rank,
  circulating_supply
}) => {

  const sendToParent = () => {
    handler([name, id, image])
  }

  // Modal Methods
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleClick = () => {
    setOpen(true)
  };
  
  // const formatDate = (date) => {
  //   return new Intl.DateTimeFormat('en-US').format(date)
  // }

  return ( <>

    <Modal open={open} onClose={handleClose} className='coin__modal'>
      <div className='coin__modal__container'>

        <div className='coin__modal__header'>
          <img src={image} alt='crypto'/>
          <h1>{name}</h1>
          <div className='coin__modal__symbol'>{symbol}</div>  
          <p className='coin__modal__price'>
            ${price.toLocaleString()}
          </p>
          {priceChange < 0 ? (
            <p className='coin__modal__percent red'>{priceChange.toFixed(2)}%</p>
          ) : (
            <p className='coin__modal__percent green'>{priceChange.toFixed(2)}%</p>
          )}
          
        </div>


        <section className='coin__modal__data'>
            


        
        <div className='coin__modal__24'>
          
          <div className='data1'>
            <span className='modal__title'>24h High: </span> 
            ${high_24h.toLocaleString()}
          </div>
          <div className='data1'>
            <span className='modal__title'>24h Low: </span> 
            ${low_24h.toLocaleString()}
          </div>
          <div className='data1'><span className='modal__title'>24h Price Change: </span> ${price_change_24h}</div>
          <div className='data1'><span className='modal__title'>24h Vol: </span> ${volume.toLocaleString()}</div>

        </div>

        <div className='coin__modal__supply'>
          <div className='supply1'>
          <span className='modal__title'>Market Cap: </span>${marketcap.toLocaleString()}
          </div>

          <div className='supply1'>
          <span className='modal__title'>Max Supply: </span>{max_supply}
          </div>
          
          <div className='supply1'> 
          <span className='modal__title'>Circulating supply: </span>{circulating_supply.toLocaleString()}
          </div>
        </div>

        <div className='coin__modal__ath'>
          <div className='ath1'><span className='modal__title'>All Time High: </span>${ath.toLocaleString()}</div>
          <div className='ath1'><span className='modal__title'>ATH Date </span>{dayjs(ath_date).format('MM-DD-YYYY')}</div>
          <div className='ath1'><span className='modal__title'>% Change from ATH: </span>{ath_change_percentage}%</div>
        </div>


        </section>

      </div>
      
    </Modal>

    <div className='coin-container'>

      <div className='coin-row'>

        <div className='coin'>
          <p className='coin-rank'>{market_cap_rank}</p>
          <img src={image} alt='crypto' />
          <h1>{name}</h1>
          <p className='coin-symbol'>{symbol}</p>
        </div>

        <div className='coin-data'>          
          <p className='coin-price'>${price.toLocaleString()}</p>
          

          {priceChange < 0 ? (
            <p className='coin-percent red'>{priceChange.toFixed(2)}%</p>
          ) : (
            <p className='coin-percent green'>{priceChange.toFixed(2)}%</p>
          )}

          <p className='coin-marketcap'>
            Mkt Cap: ${marketcap.toLocaleString()}
          </p>
        </div>
        
        <button className='select_button'onClick={sendToParent}>Select</button>

        <button className='select_button'onClick={handleClick}>Info</button>
      </div>

    </div>
  
  </>);
};

export default Coin;
