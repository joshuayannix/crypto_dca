import React, { useEffect, useState } from 'react'
import Pusher from 'pusher-js';
import axiosInstance from './axios'
import { useHistory, Link, useLocation } from "react-router-dom";

function SavedSearches() {
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

  return (
    <div>
      <h1>saved searches page!</h1>
      <Link to='/'>Home</Link>

      {messages.map((message) => (
        <>
          <div>
            <div>Amount: {message.amount}</div>
            <div>Crypto: {message.cointype}</div>
            <div>Frequency: {message.freq}</div>
            <div>Start date: {message.start}</div>
            <div>End Date: {message.end}</div>
            <div>{message.searchquery}</div>
            <div>Date saved: {message.timestamp}</div>
            <div>{message.coinimageurl}</div>
            <div>User: {message.user}</div>               
          </div>
          <button>Click to run this search</button>
        </>
      ))}

    </div>
  )
}

export default SavedSearches
