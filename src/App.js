/**
 * Experimentation & Evaluation SP2022
 * USI - Università della Svizzera italiana
 * Project: Cases Styles Experiments
 *
 * Authors: Erick Garro Elizondo & Cindy Guerrero Toro
 */

import logo from './logo.svg';
import './App.css';

import {useState, useContext} from "react";
import { CookiesProvider, useCookies } from 'react-cookie';
import { createQuestions } from './experiment/Questions.js';
require('typeface-open-sans')

function getOption() {
  return (<div className='option'>
    <button className='wrong'><span className='word1'>good</span><span className='word2'>Mood</span></button>
  </div>
  );
}

/*
 * This is the main component of the application.
 * It is the entry point of the application.
*/
function App() {
  const [userId, setUserId] = useCookies();
  const [context, setContext] = useState(null);
  const [questions, setQuestions] = useState(createQuestions());
  const [currentQuestion, setCurrentQuestion] = useState(questions[0]);

  /*
   * This function creates a unique user id. The cookie expires after 30 days.
   *
   * @returns {string} - The user id.
  */
  function createUserId() {
    const userId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setUserId('userId', userId, {expires: new Date(Date.now() + 2592000000) });
    return userId;
  }

  /*
   * This method finds out if the user has a cookie set with the user id.
   * If the user has a cookie set, return the user id.
   * If the user does not have a cookie set, create a new user id and return it.
   *
   */
  function getUserIdOnLoad() {
    if (userId.userId) {
      return userId.userId;
    } else {
      return createUserId();
    }
  }

  /* This function return the user id

   *  @returns {string} - The user id.
   */
  function getUserId() {
    return userId.userId;
  }


  getUserIdOnLoad();

  return (
    // context provider

    <CookiesProvider>
      <div className="App">
        {/*    {getUserId()}*/}

        <div className="container">
          <div className="control">
            <p>Task 1 of 2</p>
          </div>
          <div className="words">
            <h1>good mood</h1>
          </div>
          <div className="answers">
            <div className='options-container'>
              {currentQuestion.options.map(getOption)}
            </div>
          </div>

          <p className="feedback"> Well done!</p>

          <div className="action">
            {/*continue button*/}
            <button className="continue">Continue</button>
          </div>
          <div class="footer">

          </div>
        </div>
      </div>
    </CookiesProvider>
  );
}

export default App;
