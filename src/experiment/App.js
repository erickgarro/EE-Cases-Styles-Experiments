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


/*
 * This is the main component of the application.
 * It is the entry point of the application.
*/
function App() {
  const [userId, setUserId] = useCookies();

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

  /* this function return the user id

   */
  function getUserId() {
    return userId.userId;
  }


  getUserIdOnLoad();

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
