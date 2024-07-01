import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import '../Css/style.css'; 
import imagePassword from '../img/passwordLock.png';

const ForgotPassword = () => {
    const [formData, setFormData] = useState({
      password1: '',
      password2: '',
    });
  
    const [error, setError] = useState('');
  
    const navigate = useNavigate();
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
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
  
    return (
      <div className='centerContent'>
        <div className='flexColumn10'>
          <div className='flexRow13'>
            <img src={imagePassword} width='64' height='64' alt='LockPassword Icon' />
          </div>
  
          <div className='flexRow14'>
            <h1>Forgot Password?</h1>
            <p>Enter your email address to receive reset instructions</p>
          </div>
  
          <div className='flexRowEmail'>
            <input type='text' id='email' name='email' placeholder='Email' /><br />
          </div>
  
          <input
            type='password'
            id='password1'
            name='password1'
            placeholder='Password'
            value={formData.password1}
            onChange={handleChange}
          /><br />
          {formData.password1 && (
            <>
              <h4>A Password must include the following: </h4>
              <ul>
                <li id='check-length'>8-20 Characters</li>
                <li id='check-capital'>At least one capital letter</li>
                <li id='check-number'>At least one number</li>
                <li id='check-special'>At least one special character</li>
              </ul>
            </>
          )}
          <input
            type='password'
            id='password2'
            name='password2'
            placeholder='Retype Password'
            value={formData.password2}
            onChange={handleChange}
          /><br />
          {error && <div id='error-message' style={{ color: 'red' }}>{error}</div>}
        </div>
      </div>
    );
  };
  
  export default ForgotPassword;