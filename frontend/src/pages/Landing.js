import React, { useState } from 'react';
import { L } from '../components/auth/L';
import { S } from '../components/auth/S';

export const Landing = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignup(false); // Make sure signup is closed when login is opened
  };

  const handleSignupClick = () => {
    setShowSignup(true);
    setShowLogin(false); // Make sure login is closed when signup is opened
  };

  return (
    <div>
      <button onClick={handleLoginClick}>Login</button>
      <button onClick={handleSignupClick}>Signup</button>

      {showLogin && <L />}
      {showSignup && <S />}
    </div>
  );
};
