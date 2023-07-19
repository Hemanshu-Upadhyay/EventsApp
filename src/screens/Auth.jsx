import React, {useState} from 'react';
import Signup from '../components/Authentication/Signup';
import Signin from '../components/Authentication/Signin';

const Auth = ({setToken}) => {
  const [currentScreen, setCurrentScreen] = useState('Signin');
  return currentScreen === 'Signin' ? (
    <Signin navigate={setCurrentScreen} setToken={setToken} />
  ) : (
    <Signup navigate={setCurrentScreen} setToken={setToken} />
  );
};

export default Auth;
