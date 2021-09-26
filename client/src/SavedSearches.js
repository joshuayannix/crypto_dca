import React, { useEffect, useState } from 'react'
import Pusher from 'pusher-js';
import axiosInstance from './axios'
import { useHistory } from "react-router-dom";
import './SavedSearches.css'

// Framer motion imports
import { animationOne,  animationTwo, animationThree, transition } from './animations';
import { motion } from 'framer-motion';

function SavedSearches() {
  
  const history = useHistory();

  /*** Retrieve Messages from MongoDB **********/
  const [messages, setMessages] = useState([])

  useEffect(() => {
    axiosInstance.get('/messages/sync')
      .then(response => {
        setMessages(response.data)
      })
  }, []);

  useEffect(() => {
    const pusher = new Pusher('72ef0f1bbd0d6ba3d49d', {
      cluster: 'us2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage) => {
      // alert(JSON.stringify(newMessage));
      setMessages([...messages, newMessage])
    });

    // The clean up function. Remove the new listener
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };

  }, [messages]);

  // pusher for delete events
  // useEffect(() => {
  //   const pusher = new Pusher('72ef0f1bbd0d6ba3d49d', {
  //     cluster: 'us2'
  //   });
  //   console.log('delete trigger pusher test')

  //   const channel = pusher.subscribe('messages');
  //   channel.bind('deleted', () => {
  //     alert('deleting message')
  //     console.log('deleting message')
  //     setMessages([...messages])
  //   })

  //   return () => {
  //     channel.unbind_all();
  //     channel.unsubscribe();
  //   };

  // }, [messages])

  console.log(messages);

  /*******************************************/

  const runSearch = (searchquery) => {
    history.push({
      pathname: '/show',
      search: searchquery,
    })
  }

  const deleteSearch = id => {
    axiosInstance.delete(`/messages/delete/${id}`).then((res) => {
      console.log('deleted search: ' + id);
      setMessages(
        messages.filter((val) => {
          return val._id !== id;
        })
      )
      window.location.reload()
    })
  }


  let timestamp = "Sun, 04 Jul 2021 21:30:01 GMT"
  let datetimestamp = new Date(timestamp)
  console.log(datetimestamp.getMonth())
  console.log(datetimestamp.getTime())



  const formatDate = (str) => {
    let daysOfWeek = { 0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday' }
    let monthsObject = { 0: 'January', 1: 'February', 2: 'March', 3: 'April', 4: 'May', 5: 'June', 6: 'July', 7: 'August', 8: 'September', 9: 'October', 10: 'November', 11: 'December' };

    let dateObject = new Date(str);
    let year = dateObject.getFullYear();
    let date = dateObject.getDate();
    let month = monthsObject[dateObject.getMonth()];
    let day = daysOfWeek[dateObject.getDay()];

    return `${day}, ${month} ${date}, ${year}`
  }

  const freqMap = { 1: 'Daily', 7: 'Weekly', 30: 'Monthly' } 

  return (
    <motion.div
    initial='out' 
    animate='in' 
    exit='out' 
    variants={animationTwo}
    >
    <div className='savedsearches'>
      <h3>Saved Searches</h3>

        {messages.slice(0).reverse().map((message) => (
          <>
            <div className='single__search'> 
              <div className='single__search__col0'>
                <img className ='coin_image' alt='crypto' src={message.coinimageurl}/>  
                <div><span className='boldLabel'>{message.cointype}</span></div>
              </div>
              
              <div className="col1_col2__container">
                <div className='single__search__col'>
                  <div><span className='boldLabel'>Amount:</span> ${message.amount}</div>     
                  <div><span className='boldLabel'>Frequency:</span> {freqMap[message.freq]}</div>
                  <div><span className='boldLabel'>User:</span> {message.user}</div>  
                </div>

                <div className='single__search__col'>
                  <div><span className='boldLabel'>Start Date:</span> {formatDate(message.start)}</div>
                  <div><span className='boldLabel'>End Date:</span> {formatDate(message.end)}</div>
                  <div><span className='boldLabel'>Date Saved:</span> {formatDate(message.timestamp)}</div>     
                </div>
              </div>
              

              <div className='buttons__container'>
                <button className='run_button' onClick={() => runSearch(message.searchquery)}>Run Search</button>  

                <button className='delete_button' onClick={() => deleteSearch(message._id)}>Delete Search</button>     
                                       
              </div>
                        
                     
            </div>
            
          </>
        ))}


    </div>

    </motion.div>
  )
}

export default SavedSearches
