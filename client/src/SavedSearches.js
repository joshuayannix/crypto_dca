import React, { useEffect, useState } from 'react'
import Pusher from 'pusher-js';
import axiosInstance from './axios'
import { useHistory } from "react-router-dom";
import './SavedSearches.css'

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

  const freqMap = {
    1: 'Daily',
    7: 'Weekly',
    30: 'Monthly'
  }

  return (
    <div className='savedsearches'>
      <h3>Saved Searches</h3>

      <div className='savedsearches__body'>

      
        {messages.slice(0).reverse().map((message) => (
          <>
            <div className='single__search'> 
              <div className='single__search__col0'>
                <img className ='coin_image' alt='crypto' src={message.coinimageurl}/>  
                <div>{message.cointype}</div>
              </div>

              <div className='single__search__col'>
                <div>Amount: ${message.amount}</div>     
                <div>Frequency: {freqMap[message.freq]}</div>
                <div>User: {message.user}</div>  
              </div>

              <div className='single__search__col'>
                <div>Start Date: {message.start}</div>
                <div>End Date: {message.end}</div>
                <div>Date saved: {message.timestamp}</div>     
              </div>

              <div className='single__search__col'>
                
                                       
              </div>
                        
              <button 
                className='run_button'
                onClick={() => runSearch(message.searchquery)}
              >
                Run Search
              </button>     
              <button 
                className='delete_button'
                onClick={() => deleteSearch(message._id)}
              >
                Delete Search
              </button>            
            </div>
            
          </>
        ))}

      </div>

    </div>
  )
}

export default SavedSearches
