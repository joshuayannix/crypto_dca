import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import axios from 'axios'
import Coin from './Coin';
import './Home.css';
import blank from './blank.gif'

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

    const dateString = `?start=${startDateString}&end=${endDateString}`;

    return `${dateString}&amount=${amount}&freq=${frequencyNumeric}&coinType=${selection[1]}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!selection) {
      alert('Please Select a cryptocurrency and calculate again')
      return
    }
    const query = buildQuery()
    history.push({
      pathname: '/show',
      search: query
    })
    //console.log(history)
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

      <div className='home_title'>
        <h2>Cryptocurrency Dollar Cost Average Calculator</h2>
        <p className='instructions'>
          Select a cryptocurrency, start and end date, investment amount, and a frequency.
        </p>
      </div>
      
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
              <img className='coin_img' src={selection[2] ? selection[2] : blank}/>
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
                marketcap={coin.total_volume}
                volume={coin.market_cap}
                image={coin.image}
                priceChange={coin.price_change_percentage_24h}
              />

            </div>                    
          );
        })}
      </div>
      
      
    </div>
  )
}

export default Home