import React, { useState } from 'react'
import Show from './Show'
import axios from 'axios';

// Date Field imports
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

// MaterialUI inputs
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

function Home() {
  let query = {};

  const [crypto, setCrypto] = useState('')
  const [amount, setAmount] = useState('')
  const [startDate, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const apiAxios = async (crypto, startDate, endDate) => {
    const startDateUnix = new Date(startDate).getTime() / 1000;
    const endDateUnix = new Date(endDate).getTime() / 1000;;    

    try {
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${crypto}/market_chart/range?vs_currency=usd&from=${startDateUnix}&to=${endDateUnix}`
      )
      console.log(res.data.prices)

    } catch (error) {
      console.log('error from apiAxios', error)
    }    
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    apiAxios(crypto, startDate, endDate)
    /* handleSubmit will call apiAxios
    apiAxios will call the api, and update the state
    */
  };

  const handleCrypto = e => {
    setCrypto(e.target.value)
  }

  const handleAmount = e => {
    setAmount(e.target.value)
  }
  
  return (
    <div>
      Home Page
      <form onSubmit={handleSubmit}>    
        
        <TextField 
          required
          variant="filled"
          id="standard-basic" 
          label="Cryptocurrency" 
          onChange={handleCrypto}
          value={crypto}
          
        />
        <br/>

        <TextField 
          required
          variant="filled"
          label="Monthly Dollar Amount" 
          onChange={handleAmount}
          value={amount}
        />
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


        <Button
          type='submit'
          color='secondary'
        >submit
        </Button>
      </form>

      <Show 
        query={query}
      />

    </div>
  )
}

export default Home