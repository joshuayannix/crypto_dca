import React, { useState } from 'react'
import { useHistory } from "react-router-dom";

// Date Field imports
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

// MaterialUI inputs
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

function Home() {
  const history = useHistory();

  const [crypto, setCrypto] = useState('')
  const [amount, setAmount] = useState('')
  const [startDate, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [apiPrices, setApiPrices] = useState([])
  const [dataArr, setDataArr] = useState([]);


  const buildQuery = () => {
    const frequencyNumeric = 30
    const dateString = `?start=${startDate.format(
      "YYYY-MM-DD"
    )}&end=${endDate.format("YYYY-MM-DD")}`;
    return `${dateString}&amount=${amount}&freq=${frequencyNumeric}&coinType=${crypto}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const query = buildQuery()

    history.push({
      pathname: '/show',
      search:query
    })
    console.log(history)
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

      <div>
        apiPrices: {apiPrices.length}
      </div>

      <div>
        dataArr: {dataArr.length}
      </div>

      


 
     

 

    </div>
  )
}

export default Home