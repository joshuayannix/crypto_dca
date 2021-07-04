import React, { useEffect } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import Home from './Home'
import Show from './Show';
import Navbar from './Navbar';
import SavedSearches from './SavedSearches';
import Login from './Login';

// User Auth imports
import { auth } from './firebase';
import { useDispatch } from 'react-redux'
import { login, logout } from './features/userSlice';

function App() {
  // User Authentication
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged(authUser => {
      console.log('The user is logged in:', authUser)

      if(authUser) {      
        dispatch(login({
          uid: authUser.uid,
          photo: authUser.photoURL,
          email: authUser.email,
          displayName: authUser.displayName
        }))
      } else {
        dispatch(logout())
      }

    })
  }, [dispatch]);


  return (
    <BrowserRouter>
      <div>

        <Route exact path = '/'>
          <Navbar />
          <Home />
        </Route>

        <Route path = '/show'>
          <Navbar />
          <Show />
        </Route>

        <Route path='/login'> 
          <Navbar />   
          <Login />       
        </Route>

        <Route path = '/savedsearches'>
          <Navbar />
          <SavedSearches />
        </Route>

      </div>
    </BrowserRouter>
  );
}

export default App;
