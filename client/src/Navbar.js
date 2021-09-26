import React, {useEffect, useState} from 'react';
import Pusher from 'pusher-js';
import axiosInstance from './axios'
import { Link } from 'react-router-dom';
import './Navbar.css';
import coingecko from './CoinGecko.png';

// User auth imports
import { useSelector } from 'react-redux';
import { auth } from './firebase';
import { selectUser } from './features/userSlice';


function Navbar() {
  const [showMenu, setShowMenu] = useState(false);

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

  //console.log(messages);

  /********* User Auth Functions *************/

  const user = useSelector(selectUser);
  //console.log(user)
  const handleAuthentication = () => {
    if (user) {
      auth.signOut();
    }
  }

  const toggleHamburger = (e) => {
    e.preventDefault();
    setShowMenu(!showMenu)
  }

  let menu;

  if(showMenu) {
    menu = 
      <div className="hamburger__links__container">    
        <Link className='navbar__link saved__section' to='/savedsearches'>
          Saved Searches: 
          <div className='notifications'>
            {messages.length}
          </div> 
        </Link>

        <Link to={!user && '/login'} className='navbar__link'>
          <div 
            onClick={handleAuthentication}
            className="header__option"
          >
            <span className='header__optionLineOne'>Hello, {user ? user.displayName : 'Guest'}. </span>
            <span className='header__optionLineTwo'>{user ? 'Sign Out' : 'Sign In'}</span>
          </div>
        </Link> 
      </div>
  }

  return (
    <div className='navbar__component'>

      <div className="title__container">
        <Link className='title__link' to='/'>
          CryptoDCA
        </Link>

        <a className='navbar__link' id='coingecko__container' href='https://www.coingecko.com'>
          <div>
            <span>Powered by:</span>
            <img alt='coingecko logo' src={coingecko}/>
          </div>
        </a>
      </div>
      
      <a href="" class="toggle-button" onClick={toggleHamburger}>
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </a>
      
      { menu }

      <div className='fullsize__links__container'>

        <Link className='navbar__link saved__section' to='/savedsearches'>
          Saved Searches: 
          <div className='notifications'>
            {messages.length}
          </div> 
        </Link>

        <Link to={!user && '/login'} className='navbar__link'>
          <div 
            onClick={handleAuthentication}
            className="header__option"
          >
            <span className='header__optionLineOne'>Hello, {user ? user.displayName : 'Guest'}. </span>
            <span className='header__optionLineTwo'>{user ? 'Sign Out' : 'Sign In'}</span>
          </div>
        </Link> 
                    
      </div>

    </div>
  )
}

export default Navbar
