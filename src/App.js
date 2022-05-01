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
require('typeface-open-sans')

const server = process.env.REACT_APP_SERVER;
// const server = process.env.REACT_APP_LOCAL_SERVER;

let responsesTemplate = {
  user: {},
  answers: {}
};

let userTemplate = {
  id: '',
  age : 0,
  gender: '',
  background: '',
  gaveConsent: true
};

let sortedColors = ['word1', 'word2', 'word3'];

/*
 * This is the main component of the application.
 * It is the entry point of the application.
*/
function App() {
  const [cookie, setCookie] = useCookies();
  const [questions, setQuestions] = useState({});
  const [completedTasks, setCompletedTasks] = useState(0);
  const [currentTask, setCurrentTask] = useState(1);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(userTemplate);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [responses, setResponses] = useState(responsesTemplate);
  const [colors, setColors] = useState(() => sortedColors.sort(() => Math.random() - 0.5));

  // Fetch user ID and questions, either from the server or from the cookies and local storage
  useEffect(() => {
    if (!cookie.userId) {
      try {
        async function fetchData() {
          let response = await fetch(server + '/users/getId', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          let data = await response.json();
          // Set cookie with expiration date after 30 days
          setCookie('userId', data.userId, {expires: new Date(Date.now() + 2592000000) });

          // Fetch questions/get/ with the user ID to get the questions
          response = await fetch(server + '/questions/generate/' + data.userId, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          data = await response.json();
          setQuestions(data => data);
          localStorage.setItem('questions', JSON.stringify(data));
        }
        fetchData().then(r => console.log(r));
      } catch (error) {
        console.log(error);
      }
    } else {
      // Get questions from local storage
      setQuestions(() => JSON.parse(localStorage.getItem('questions')));

      // Get answers in progress from local storage
      let localResponses = localStorage.getItem('responses');
      if (localResponses) {
        setResponses(() => JSON.parse(localResponses));
      }
      //Get setCompletedTasks from local storage
      let localCompletedTasks = localStorage.getItem('completedTasks');
      if (localCompletedTasks) {
        setCompletedTasks(() => JSON.parse(localCompletedTasks));
        setCurrentTask(() => JSON.parse(localCompletedTasks));
      }
    }
  }, [setCookie, cookie.userId]);

  /*
   * This function generate the html code for one option of a question
   *
   * @param {Object} option - The option to generate the html code
   * @param {Number} index - The index of the option
   * @return {String} - The html code for the option
   */
  function getOneOption(option, colorType, colors, caseStyle) {
    return (
      <div key={option.id} className='option'>
        <button className={`option ${hasAnswered ? `${(option.correct) ? 'correct' : 'wrong'}` : ''}`} onClick={() => handleWordSelection(option, currentTask)}>
          <span className={`${colorType === 'chromatic' ? colors[0] : ''}`}>{option.words[0]}</span>
          {(caseStyle === 'kebab') ? <span className={(colorType === 'chromatic' && caseStyle === 'kebab') ? 'hyphen' : ''}>-</span>: ''}
          <span className={`${colorType === 'chromatic' ? colors[1] : ''}`}>{option.words[1]}</span>
          {(option.words.length > 2 && caseStyle === 'kebab') ? <span className={(colorType === 'chromatic' && caseStyle === 'kebab') ? 'hyphen' : ''}>-</span>: ''}
          {option.words.length === 3 && <span className={`${colorType === 'chromatic' ? colors[2] : ''}`}>{option.words[2]}</span>}
        </button>
      </div>
    );
  }

  function getNexWord() {
    setSuccess(() => false);
    setHasAnswered(() => false);
    setCompletedTasks(() => completedTasks + 1);
    setCurrentTask(() => currentTask + 1);
    setColors(() => sortedColors.sort(() => Math.random() - 0.5));
  }

  /*
   * This function generate the html code for all the options of a question
   *
   * @return {String} - The html code for the options
   */
  function getOptions() {

    return (
      <div className="App">
        <div className="container">
          <div className="control">
            <p>Task {completedTasks + 1} of {questions.questions.length}</p>
          </div>
          <div className="words">
            <h1>{questions.questions[currentTask].words.join(' ')}</h1>
          </div>
          <div>
            <h2 className="statement">Can you spot the words?</h2>
          </div>
          <div className="answers">
            <div className='options-container'>
              {
                // Map through the questions and get the options
                questions.questions && questions.questions[currentTask].options.map(option => {
                  return getOneOption(option, questions.questions[currentTask].color, colors, questions.questions[currentTask].caseStyle);})
              }
            </div>
          </div>
         {success ? <div className={`feedback ${!hasAnswered ? 'hidden' : ''}`}>Well done!</div> :
           <div className={`feedback ${!hasAnswered ? 'hidden' : ''}`}>Oops! Not quite right.</div>}
          <div className="action">
            <button className={`continue ${!hasAnswered ? 'hidden' : ''}`} onClick={() => getNexWord()}>Continue</button>
          </div>
          <div className="footer">
          </div>
        </div>
      </div>
    )
  }

  /*
   * This function adds an event listener is called when the user clicks on an option. It sets the success variable to true or false depending
   * on the property 'correct' of the option.
   */
  function handleWordSelection(option, taskId) {
    if (!hasAnswered) {
      setSuccess(() => option.correct);
      setHasAnswered(() => true);
      option.time = 0;
      let selection = responses;
      // add taskId as element of selection.response and assign option to it
      selection.answers[taskId] = option;
      setResponses(() => selection);
      localStorage.setItem('responses', JSON.stringify(selection));
      localStorage.setItem('completedTasks', JSON.stringify(completedTasks + 1));
      //ToDo: add a timer to the task
    }
  }


  return (
    // <Context.provider value={{ questions, dispatch }}>
    // <Context.provider value={{}}>
      <CookiesProvider>
        {questions.questions ? getOptions() : <h2>Loading...</h2>}
      </CookiesProvider>
    // </Context.provider>
  );
}

export default App;
