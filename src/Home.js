import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import axios from 'axios'
import Coin from './Coin';

// MaterialUI inputs
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
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
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false'
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
    <div>
      Select a cryptocurrency, start and end date, investment amount, and a frequency.
      <form onSubmit={handleSubmit}>    
        
        <TextField 
          required
          variant="filled"
          label="Amount To Invest" 
          onChange={handleAmount}
          value={amount}
        />
        <br/>

        <FormControl required >
          <InputLabel htmlFor="age-native-required">Frequency</InputLabel>
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


        <br/>

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
        <br />


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
        <br/>

        <h2>Your Selection: {selection[0]}</h2>
        <br/>
        <Button
          type='submit'
          color='secondary'
        >Calculate
        </Button>
      </form>

      <div className='coin-search'>
        <h1 className='coin-text'>Search a currency</h1>
        <form>
          <input
            className='coin-input'
            type='text'
            onChange={handleChange}
            placeholder='Start typing here to filter on a cryptocurrency'
            size='80'
          />
        </form>
      </div>


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
  )
}

export default Home