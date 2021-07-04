import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import axios from 'axios'
import Coin from './Coin';
import './Home.css';
import blank from './blank.gif'
import dayjs from "dayjs";


// MaterialUI inputs
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';


function Home() {
  const history = useHistory();

  // List of Coins
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');

  // Form Inputs
  const [amount, setAmount] = useState('')
  const [freq, setFreq] = useState('')
  const [startDate, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const[selection, setSelection] = useState('')

  // Get list of coins from API and set coins in state
  useEffect(() => {
    axios
      .get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
      )
      .then(res => {
        setCoins(res.data);
        console.log(res.data);
      })
      .catch(error => console.log(error));
  }, [])

  /* Make API call from backend server.js */
  
  // useEffect(() => {
  //   console.log('calling getCoinList')
  //   getCoinList()
  // }, [])

  // Currently not working because coinlist data not showing up in response
  // async function getCoinList() {
  //   const response = await fetch('/coinlist');
  //   console.log(response)
  //   const data = await response.json();
  //   console.log('data from getCoinList: ', data)
  // }
  
  /***********************************/

  const handleChange = e => {
    setSearch(e.target.value);
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  const buildQuery = () => {
    const frequencyNumeric = freq;
    const startDateString = `${startDate.getFullYear()}-${(startDate.getMonth()+1).toString().padStart(2,0)}-${(startDate.getDate()).toString().padStart(2,0)}`;
    const endDateString = `${endDate.getFullYear()}-${(endDate.getMonth()+1).toString().padStart(2,0)}-${(endDate.getDate()).toString().padStart(2,0)}`;

    if(startDateString === endDateString) {
      alert('Start date cannot be the same as End date')
      return
    }
    const dateString = `?start=${startDateString}&end=${endDateString}`;

    return `${dateString}&amount=${amount}&freq=${frequencyNumeric}&coinType=${selection[1]}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(amount <= 0) {
      alert('Amount must be greater than 0')
      return
    }

    if(!selection) {
      alert('Please Select a cryptocurrency and calculate again')
      return
    }

    const startDateString = `${startDate.getFullYear()}-${(startDate.getMonth()+1).toString().padStart(2,0)}-${(startDate.getDate()).toString().padStart(2,0)}`;
    const endDateString = `${endDate.getFullYear()}-${(endDate.getMonth()+1).toString().padStart(2,0)}-${(endDate.getDate()).toString().padStart(2,0)}`;

    if(startDateString === endDateString) {
      alert('Start date cannot be the same as End date')
      return
    }

    console.log('start and end datestring', startDateString, endDateString)

    // Validate start and end date cannot be before 1-12-2009
    

    // Validate that duration cannot be negative (start date cant be after end date)
    const getDuration = (a, b) => {
      let dayjsA = dayjs(a)
      let dayjsB = dayjs(b)
      let difference = dayjsB.diff(dayjsA, 'days')
      return difference
    }
    
    let duration = getDuration(startDateString, endDateString);
    if(duration < 0) {
      alert('Start date cannot be after the end date')
      return
    }

    const query = buildQuery()
    history.push({
      pathname: '/show',
      search: query,
    })
  };

  const handleAmount = e => {
    setAmount(e.target.value)
  }

  const handleFreq = e => {
    setFreq(e.target.value)
  }

  const handleSelect = e => {
    console.log("e: ",e)

    setSelection(e)
    console.log('selection in state: ',selection)
  }

  
  return (
    <div className='home'>

      
      <form onSubmit={handleSubmit} className='inputs'>    
        
        <div className='amount_frequency'>
          <TextField 
            required            
            label="Amount To Invest" 
            onChange={handleAmount}
            value={amount}
          />

          <FormControl required >
            <InputLabel
              htmlFor="age-native-required"
            >
              Frequency
            </InputLabel>
            <Select
              native
              value={freq}
              onChange={handleFreq}
              name="age"
              inputProps={{
                id: 'age-native-required',
              }}
            >
              <option aria-label="None" value="" />
              <option value={30}>Monthly</option>
              <option value={7}>Weekly</option>
              <option value={1}>Daily</option>
            </Select>
            <FormHelperText>Required</FormHelperText>
          </FormControl>

        </div>
        
        <div className='date_inputs'>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker 
              margin="normal"
              id="date-picker-dialog"
              label="Start Date"
              format="MM/dd/yyyy"
              value={startDate}
              onChange={setDate}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker 
              margin="normal"
              id="end-date-picker-dialog"
              label="End date"
              format="MM/dd/yyyy"
              value={endDate}
              onChange={setEndDate}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
        </div>
        
        <div className='calculate_section'>

          <div className='your_selection'>
            <div className='calculate_title'>
              Your Selection:
            </div>
            <div className='coin_selection'>
              <img className='coin_img' alt='coin' src={selection[2] ? selection[2] : blank}/>
              {selection[0]}

            </div>
          </div>
          
          <button type='submit' className='calculate_button'>
            Calculate
          </button>

        </div>           
        
      </form>

      {/* Coin results */}

      <div className='coin_results'>
        <h4 className='coin-text'>Select a cryptocurrency</h4>
        <form>
          <input
            className='search_bar'
            type='text'
            onChange={handleChange}
            placeholder='Start typing here to filter on a cryptocurrency'
            size='80'
          />
        </form>

        {filteredCoins.map(coin => {
          return (
            <div>          
              <Coin
                handler={handleSelect}
                key={coin.id}
                id={coin.id}
                name={coin.name}
                price={coin.current_price}
                symbol={coin.symbol}
                volume={coin.total_volume}
                marketcap={coin.market_cap}
                image={coin.image}
                priceChange={coin.price_change_percentage_24h}
                ath={coin.ath}
                ath_change_percentage={coin.ath_change_percentage}
                ath_date={coin.ath_date}
                high_24h={coin.high_24h}
                low_24h={coin.low_24h}
                max_supply={coin.max_supply}
                price_change_24h={coin.price_change_24h}
                market_cap_rank={coin.market_cap_rank}
                circulating_supply={coin.circulating_supply}
              />

            </div>                    
          );
        })}
      </div>
      
      
    </div>
  )
}

export default Home