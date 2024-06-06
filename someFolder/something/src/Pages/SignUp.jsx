import React, { useState } from 'react';
import '../Css/style.css';

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
    const requirements = {
      length: password.length >= 8 && password.length <= 20,
      capital: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const metRequirements = Object.values(requirements).every(Boolean);

    let strength = 'Weak';
    if (metRequirements) {
      strength = 'Strong';
    } else if (password.length >= 6 && password.length < 8) {
      strength = 'Moderate';
    }

    setPasswordStrength(strength);

    // Update checklist UI
    const checklistItems = {
      length: document.getElementById('check-length'),
      capital: document.getElementById('check-capital'),
      number: document.getElementById('check-number'),
      special: document.getElementById('check-special'),
    };

    for (const [key, element] of Object.entries(checklistItems)) {
      if (element) {
        element.style.color = requirements[key] ? 'green' : 'red';
      }
    }
  };

  const checkPassword = () => {
    if (formData.password1 !== formData.password2) {
      setError('Passwords do not match. Please try again');
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
    <div class="centerContainer">
      <div class="flexRow4">
        <h1>Welcome!!</h1>
        <h2>Already have an account?</h2>
        <button className="button-77" type="button" onClick={() => window.location.href = '/Login'}>Login</button>
      </div>

      <div class="flexRow3">
        <form id="signupForm" onSubmit={handleSubmit}>
          <h1>Sign Up</h1>
          <div class = "Name"><input type="text" id="fname" name="fname" placeholder="First name" value={formData.fname} onChange={handleChange} /><br />
          <input type="text" id="lname" name="lname" placeholder="Last name" value={formData.lname} onChange={handleChange} /><br /></div>
          <input type="text" id="username" name="username" placeholder="Username" value={formData.username} onChange={handleChange} /><br />
          <input type="email" id="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} /><br />
          <input type="password" id="password1" name="password1" placeholder="Password" value={formData.password1} onChange={handleChange} /><br />
          {formData.password1 && (
            <>
              <label htmlFor="password1" id="strengthLabel">Strength of password: {passwordStrength}</label>
              <div className="power-container">
                <div id="power-point" className={passwordStrength.toLowerCase()}></div>
              </div>
              <ul>
                <li id="check-length">8-20 Characters</li>
                <li id="check-capital">At least one capital letter</li>
                <li id="check-number">At least one number</li>
                <li id="check-special">At least one special character</li>
              </ul>
            </>
          )}
          <input type="password" id="password2" name="password2" placeholder="Retype Password" value={formData.password2} onChange={handleChange} /><br />
          {error && <div id="error-message" style={{ color: 'red' }}>{error}</div>}
          <button className="button-77" type="button" onClick={() => window.location.href = '/login.html'}>Continue</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;