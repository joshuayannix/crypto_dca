import React from 'react';
import './Login.css'
import { Link, useHistory } from 'react-router-dom';
import { auth, provider } from './firebase';


function Login() {
  const history = useHistory();

  const signIn = e => {
    e.preventDefault();
    auth
      .signInWithPopup(provider)
      .then(auth => {
        history.push('/')
      })
      .catch(error => alert(error.message))
  }

  return (
    <div className='login'>
      <Link to ='/'>

      </Link>
      <div className="login__container">
        <h3>Sign in to Crypto DCA Calculator</h3>
        <form action="">          
          <button 
            className='login__signInButton'
            onClick={signIn}
            type='submit'
          >
            Sign In With Google
          </button>
        </form>

        <p>By continuing, you agree to the Conditions of Use and Privacy Notice.</p>

      </div>
    </div>
  )
}

export default Login
