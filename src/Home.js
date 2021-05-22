import React, { useState } from 'react'
import { useHistory } from "react-router-dom";

// Date Field imports
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

// MaterialUI inputs
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';


function Home() {
  const history = useHistory();

  const [crypto, setCrypto] = useState('')
  const [amount, setAmount] = useState('')
  const [freq, setFreq] = useState('')
  const [startDate, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const buildQuery = () => {
    const frequencyNumeric = 30
    const startDateString = `${startDate.getFullYear()}-${(startDate.getMonth()+1).toString().padStart(2,0)}-${(startDate.getDate()).toString().padStart(2,0)}`;
    const endDateString = `${endDate.getFullYear()}-${(endDate.getMonth()+1).toString().padStart(2,0)}-${(endDate.getDate()).toString().padStart(2,0)}`;

    const dateString = `?start=${startDateString}&end=${endDateString}`;

    return `${dateString}&amount=${amount}&freq=${frequencyNumeric}&coinType=${crypto}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const query = buildQuery()
    history.push({
      pathname: '/show',
      search: query
    })
    //console.log(history)
  };

  const handleCrypto = e => {
    setCrypto(e.target.value)
  }

  const handleAmount = e => {
    setAmount(e.target.value)
  }

  const handleFreq = e => {
    setFreq(e.target.value)
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
          label="Amount To Invest" 
          onChange={handleAmount}
          value={amount}
        />
        <br/>

        <FormControl required >
          <InputLabel id="demo-simple-select-required-label">Frequency</InputLabel>
          <Select
            labelId="demo-simple-select-required-label"
            id="demo-simple-select-required"
            value={freq}
            onChange={handleFreq}
          >
            <MenuItem value="">
              <em>Monthly</em>
            </MenuItem>
            <MenuItem value={10}>Monthly</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
          <FormHelperText>Required</FormHelperText>
        </FormControl>

        <TextField 
          required
          variant="filled"
          label="Frequency" 
          onChange={handleFreq}
          value={freq}
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
      
    </div>
  )
}

export default Home