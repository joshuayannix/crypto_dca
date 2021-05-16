import React, { useEffect, useState } from 'react'

// Date Field imports
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';



import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

function Home() {
  const [crypto, setCrypto] = useState('')
  const [dollars, setDollars] = useState('')
  const [selectedDate, setDate] = useState(new Date());
  const [selectedEndDate, setEndDate] = useState(new Date());

  const handleSubmit = e => {
    e.preventDefault();
  };

  const handleCrypto = e => {
    setCrypto(e.target.value)
  }

  const handleDollars = e => {
    setDollars(e.target.value)
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
          onChange={handleDollars}
          value={dollars}
        />
        <br/>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker 
            margin="normal"
            id="date-picker-dialog"
            label="Start Date"
            format="MM/dd/yyyy"
            value={selectedDate}
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
            value={selectedEndDate}
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
    </div>
  )
}

export default Home