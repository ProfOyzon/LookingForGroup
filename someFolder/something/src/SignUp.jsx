import React, { useState } from 'react';
import './SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    username: '',
    email: '',
    password1: '',
    password2: ''
  });

  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'password1') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = '';
    if (password.length < 6) {
      strength = 'Weak';
    } else if (password.length < 10) {
      strength = 'Moderate';
    } else {
      strength = 'Strong';
    }
    setPasswordStrength(strength);
  };

  const checkPassword = () => {
    if (formData.password1 !== formData.password2) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkPassword()) {
      window.location.href = '/Proficencies.html';
    }
  };

  return (
    <div className="centerContainer">
      <div className="flexRow4">
        <h1>Welcome!!</h1>
        <h2>Already have an account?</h2>
        <button className="button-77" type="button" onClick={() => window.location.href = '/login.html'}>Login</button>
      </div>

      <div className="flexRow3">
        <form id="signupForm" onSubmit={handleSubmit}>
          <h1>Sign Up</h1>
          <input type="text" id="fname" name="fname" placeholder="First name" value={formData.fname} onChange={handleChange} /><br />
          <input type="text" id="lname" name="lname" placeholder="Last name" value={formData.lname} onChange={handleChange} /><br />
          <input type="text" id="username" name="username" placeholder="Username" value={formData.username} onChange={handleChange} /><br />
          <input type="email" id="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} /><br />
          <input type="password" id="password1" name="password1" placeholder="Password" value={formData.password1} onChange={handleChange} /><br />
          {formData.password1 && (
            <>
              <label htmlFor="password1" id="strengthLabel">Strength of password: {passwordStrength}</label>
              <div className="power-container">
                <div id="power-point" className={passwordStrength.toLowerCase()}></div>
              </div>
            </>
          )}
          <input type="password" id="password2" name="password2" placeholder="Retype Password" value={formData.password2} onChange={handleChange} /><br />
          {error && <div id="error-message" style={{ color: 'red' }}>{error}</div>}
          <button className="button-77" type="submit">Continue</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;