import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ErrorModal from "../../shared/components/ErrorModal";
import styles from './Signup.module.css';

import teamfitLogo from '../../images/teamfit_logo.png';
import fitnessLogo from '../../images/fitness.png';

function Signup() {

  const auth = useContext(AuthContext);
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const emailOnChangeHandler = (event) => {
    setEmail(event.target.value);
  }

  const nameOnChangeHandler = (event) => {
    setName(event.target.value);
  }

  const passwordOnChangeHandler = (event) => {
    setPassword(event.target.value);
  }

  const confirmPasswordOnChangeHandler = (event) => {
    setConfirmPassword(event.target.value);
  }

  const ageOnChangeHandler = (event) => {
    setAge(event.target.value);
  }

  const cityOnChangeHandler = (event) => {
    setCity(event.target.value);
  }

  const formSubmotHandler = async (event) => {
    event.preventDefault();

    if (!email || !name || !password || !confirmPassword || !age || !city) {
      setError('Please check your inputs.');
      return;
    }

    if (password !== confirmPassword) {
      setError(`Passwords do not matches.`);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name, email, password, image: 'dummy', age, address: city
        })
      });
      const responseData = await response.json();
      setIsLoading(false);
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      console.log(responseData);
      auth.login();
      history.push('/user/:userId');

    } catch (error) {
      console.log(error);
      setError(error.message || 'Unexpected error occured.');
    }
    setIsLoading(false);

  }


  return (
    <div className={styles.mainContainer}>
      {error && <ErrorModal error={error} onClear={() => { setError(false) }} />}
      <div className={styles.subContainer}>
        <div className={styles.leftSection}>
          <div className={styles.leftContainer}>
            
              <img className={styles.fitnessLogo} src={fitnessLogo} alt="" />
            
          </div>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.imageContainer}>
            <img className={styles.teamfitLogo} src={teamfitLogo} alt=""/>
          </div>
          <form className={styles.form} onSubmit={formSubmotHandler}>
            <div>
              {/* <label htmlFor="user-email">Email</label> */}
              <input className={styles.signupText} type='email' id="user-email" onChange={emailOnChangeHandler} value={email} placeholder="Email" />
            </div>

            <div>
              {/* <label htmlFor='user-name'>Name</label> */}
              <input className={styles.signupText} type='text' id="user-name" value={name} onChange={nameOnChangeHandler} placeholder="Username" />
            </div>

            <div>
              {/* <label htmlFor='user-password'>Password</label> */}
              <input className={styles.signupText} type='password' id="user-password" value={password} onChange={passwordOnChangeHandler} placeholder="Password"/>
            </div>

            <div>
              {/* <label htmlFor='user-confirm'>Confirm Password</label> */}
              <input className={styles.signupText} type='password' id="user-confirm" value={confirmPassword} onChange={confirmPasswordOnChangeHandler} placeholder="Confirm Password"/>
            </div>

            <div>
              {/* <label htmlFor='user-age'>Age</label> */}
              <input className={styles.signupText} type='number' id="user-age" value={age} onChange={ageOnChangeHandler} placeholder="Age"/>
            </div>

            <div>
              {/* <label htmlFor='user-city'>City</label> */}
              <input className={styles.signupText} type='text' id="user-city" value={city} onChange={cityOnChangeHandler} placeholder="City"/>
            </div>

            <button className={styles.signupButton}>Register</button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
