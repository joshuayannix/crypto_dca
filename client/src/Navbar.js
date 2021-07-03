import React, {useEffect, useState} from 'react';
import Pusher from 'pusher-js';
import axiosInstance from './axios'
import { Link } from 'react-router-dom';
import './Navbar.css';
import coingecko from './CoinGecko.png'

function Navbar() {
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
      //alert(JSON.stringify(newMessage));
      setMessages([...messages, newMessage])
    });

    // The clean up function. Remove the new listener
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };

  }, [messages]);

  console.log(messages);

  /*******************************************/



  return (
    <div className='navbar__component'>
      
      <div className='navbar__body'>

        <Link className='navbar__link' to='/'>Crypto DCA Calculator</Link>
        
        <a className='navbar__link' id='coingeckolink' href='https://www.coingecko.com'>
          <div>
            <span>Powered by:</span>
            <img alt='coingecko logo' src={coingecko}/>
          </div>
        </a>
                    
        <Link className='navbar__link saved__section' to='/savedsearches'>
          Saved Searches: 
          <div className='notifications'>
            {messages.length}
          </div> 
        </Link>

      </div>


    </div>
  )
}

export default Navbar
