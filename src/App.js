/**
 * Experimentation & Evaluation SP2022
 * USI - Università della Svizzera italiana
 * Project: Cases Styles Experiments
 *
 * Authors: Erick Garro Elizondo & Cindy Guerrero Toro
 */

import './App.css';
import Context from './components/context';
import {useState, useEffect} from "react";
import { CookiesProvider, useCookies } from 'react-cookie';
import createQuestions from './Questions';
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
  const [cookie, setCookie] = useCookies();
  const [questions, setQuestions] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [responses, dispatch] = useState(null); //ToDo: implement responses
  let getQuestions = createQuestions();

  // /*
  //  * This function creates a unique user id. The cookie expires after 30 days.
  //  *
  //  * @returns {string} - The user id.
  // */
  // function createUserId() {
  //   const cookie = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  //   setCookie('cookie', cookie, {expires: new Date(Date.now() + 2592000000) });
  //   return cookie;
  // }

  // /*
  //  * This method finds out if the user exists by assessing the existence of a cookie
  //  * with the user ID. If the user has a cookie set, return the true.
  //  * Otherwise, request new user ID, set the cookie, and return false.
  //  *
  //  * @returns
  //  */
  // function isUser() {
  //   if(!cookie.cookie) {
  //     createUserId();
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  /* This function return the user id
   *
   *  @returns {string} - The user id.
   */
  function getUserId() {
    return cookie.cookie;
  }

  // useEffect(async () => {
  //   if (!cookie.cookie) {
  //     const cookie = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  //     setCookie('userId', cookie, {expires: new Date(Date.now() + 2592000000) });
  //     let questions = getQuestions();
  //     setQuestions(questions);
  //
  //     const response = await fetch('http://localhost:8080/questions', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         cookie: getUserId(),
  //         questions: getQuestions()
  //       })
  //     });
  //     const data = await response.json();
  //     console.log(data);
  //   } else {
  //     const response = await fetch(`http://localhost:8080/questions/${cookie.cookie}`);
  //     const data = await response.json();
  //     setQuestions(data);
  //   }
  // }, [getQuestions, getUserId, setCookie, cookie.cookie]);

    //
    // if (!isUser()){
    //
    //   setQuestions(getQuestions());
    //   setCurrentQuestion(questions[0]);
    // } else {
    //   //get the questions from local storage
    //   setQuestions(JSON.parse(localStorage.getItem('questions')));
    //   setCurrentQuestion(questions[0]);
    // }
  // }, []);

useEffect(() => {
  // useEffect to check if there is a cookie with the user id
  if (!cookie.isUser) {
    fetch('http://localhost:8080/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cookie: getUserId(),
        questions: getQuestions()
      })
    })
    createUserId();
    //store the questions in local storage
    localStorage.setItem('questions', JSON.stringify(questions));
  } else {
    //get the questions from local storage
    setQuestions(JSON.parse(localStorage.getItem('questions')));
    setCurrentQuestion(questions[0]);
  }
}, []);

  useEffect(() => {
    if (!cookie.cookie) {
      const cookie = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setCookie('cookie', cookie, {expires: new Date(Date.now() + 2592000000) });
      let questions = getQuestions();
      setQuestions(questions);

      const response = fetch('http://localhost:8080/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cookie: getUserId(),
          questions: getQuestions()
        })
      });
      const data = response.json();
      console.log(data);
    } else {
      const response = fetch(`http://localhost:8080/questions/${cookie.cookie}`);
      const data = response.json();
      setQuestions(data);
    }
  }, [getQuestions, getUserId, setCookie, cookie.cookie]);


  return (
    // <Context.provider value={{ questions, dispatch }}>
    <Context.provider value={{}}>
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
                {/*{currentQuestion.options.map(getOption)}*/}
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
    </Context.provider>
  );
}

export default App;
