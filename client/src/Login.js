import React from 'react';
import './Login.css'
import { useHistory } from 'react-router-dom';
import { auth, provider } from './firebase';

// Framer motion imports
import { animationOne,  animationTwo, animationThree, transition } from './animations';
import { motion } from 'framer-motion';

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

    <motion.div
    initial='out'
      animate='end'
      exit='out'
      variants={animationThree}
    >
    <div className='login'>
 
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
    </motion.div>
  )
}

export default Login
