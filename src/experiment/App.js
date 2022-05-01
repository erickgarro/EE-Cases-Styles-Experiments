/**
 * Experimentation & Evaluation SP2022
 * USI - Università della Svizzera italiana
 * Project: Cases Styles Experiments
 *
 * Authors: Erick Garro Elizondo & Cindy Guerrero Toro
 */

import logo from './logo.svg';
import './App.css';
import { CookiesProvider, useCookies } from 'react-cookie';
import Questions from './experiment/Questions.js';
import { useEffect, useState } from "@types/react";


/*
 * This is the main component of the application.
 * It is the entry point of the application.
*/
function App() {
  const [userId, setUserId] = useCookies();
  const [questions, setQuestions] = useState();

  // Fetch new user ID and questions
  useEffect(async () => {
    if (!userId.userId) {
      try {
        let response = await fetch(server + '/users/getId', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        let data = await response.json();
        // Set cookie with expiration date after 30 days
        setUserId('userId', data.userId, {expires: new Date(Date.now() + 2592000000) });

        // Fetch questions/get/ with the user ID to get the questions
        response = await fetch(server + '/questions/generate/' + data.userId, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        data = await response.json();
        setQuestions(data);
        // Store questions in local storage
        localStorage.setItem('questions', JSON.stringify(data));
      } catch (error) {
        console.log(error);
      }
    } else {
      // Get questions from local storage
      let data = JSON.parse(localStorage.getItem('questions'));
      setQuestions(data);
    }
  }, []);

  return (
    <CookiesProvider>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <p>
            {getUserId()}
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </CookiesProvider>
  );
}

export default App;
