import React, { useEffect, useState } from 'react'
import Pusher from 'pusher-js';

function SavedSearches() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    axios.get('/messages/sync')
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

      {messages.map((message) => (
        <p>
            {message.amount}
            {message.cointype}
            {message.freq}
            {message.start}
            {message.end}
            {message.searchquery}
            {message.timestamp}
            {message.user}
        </p>
      ))}

    </div>
  )
}

export default SavedSearches
