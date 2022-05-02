/**
 * Experimentation & Evaluation SP2022
 * USI - Università della Svizzera italiana
 * Project: Cases Styles Experiments
 *
 * Authors: Erick Garro Elizondo & Cindy Guerrero Toro
 */

import './App.css';
import {useState, useEffect} from "react";
require('typeface-open-sans')

// const server = process.env.REACT_APP_SERVER;
const server = process.env.REACT_APP_LOCAL_SERVER;

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
  const [questions, setQuestions] = useState({});
  const [completedTasks, setCompletedTasks] = useState(0);
  const [currentTask, setCurrentTask] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(userTemplate);
  const [userId, setUserId] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [responses, setResponses] = useState(responsesTemplate);
  const [colors, setColors] = useState(() => sortedColors.sort(() => Math.random() - 0.5));

  useEffect(() => {
    if(completedTasks === 20) {
      async function submitResponses () {
        const response = await fetch(`${server}/responses/submit/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(responses)
        });
        const data = await response.json();
        console.log(data);
      }
      submitResponses().then(() => {
        console.log('Submitted');
      });
    }
  }, [completedTasks, responses]);
  // useEffect(() => {
  //   if (localStorage.getItem('responses')) {
  //     if (completedTasks === 20 && userId) {
  //       try {
  //         async function fetchData() {
  //           const response = await fetch(`${server}/responses/submit/${userId}`, {
  //             method: 'POST',
  //             headers: {
  //               'Content-Type': 'application/json'
  //             },
  //             body: JSON.stringify(responses)
  //           });
  //           const data = await response.json();
  //           console.log(data);
  //         }
  //
  //         fetchData().then(r => console.log(r));
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   }
  // }, [completedTasks, responses, userId]);

  useEffect(() => {
    // look for userId in localStorage
    if (localStorage.getItem('userId')) {
      setUserId(localStorage.getItem('userId'));
    } else {
      // if not found, generate a new one
      const newUserId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('userId', newUserId);
      setUserId(newUserId);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem('userId')) {
      const id = localStorage.getItem('userId');

      if (localStorage.getItem('questions')) {
        setQuestions(JSON.parse(localStorage.getItem('questions')));
      } else {
        // if not found, fetch questions from server
        async function fetchData() {
          const response = await fetch(server + '/questions/get/' + id);
          const data = await response.json();
          localStorage.setItem('questions', JSON.stringify(data));
          setQuestions(data);
        }

        fetchData().then(r => console.log(r));
      }
    }
  }, []);

  useEffect(() => {
    // check if there are already responses in localStorage
    if (localStorage.getItem('responses')) {
      setResponses(JSON.parse(localStorage.getItem('responses')));
    }
    //check if there are already completed tasks in localStorage
    if (localStorage.getItem('completedTasks')) {
      setCompletedTasks(JSON.parse(localStorage.getItem('completedTasks')));
    }

    // check if there is already a user in currentTask
    if (localStorage.getItem('currentTask')) {
      setCurrentTask(JSON.parse(localStorage.getItem('currentTask')));
    }

  }, []);

  /*
   * This function generate the html code for one option of a question
   *
   * @param {Object} option - The option to generate the html code
   * @param {Number} index - The index of the option
   * @return {String} - The html code for the option
   */
  const getOneOption = (option, colorType, colors, caseStyle) =>{
    return (
      <div key={option.id} className='option'>
        <button className={`option ${hasAnswered ? `${(option.correct) ? 'correct' : 'wrong'}` : ''}`} onClick={() => handleWordSelection(option, currentTask + 1)}>
          <span className={`${colorType === 'chromatic' ? colors[0] : ''}`}>{option.words[0]}</span>
          {(caseStyle === 'kebab') ? <span className={(colorType === 'chromatic' && caseStyle === 'kebab') ? 'hyphen' : ''}>-</span>: ''}
          <span className={`${colorType === 'chromatic' ? colors[1] : ''}`}>{option.words[1]}</span>
          {(option.words.length > 2 && caseStyle === 'kebab') ? <span className={(colorType === 'chromatic' && caseStyle === 'kebab') ? 'hyphen' : ''}>-</span>: ''}
          {option.words.length === 3 && <span className={`${colorType === 'chromatic' ? colors[2] : ''}`}>{option.words[2]}</span>}
        </button>
      </div>
    );
  }

  const getNexWord = () =>{
    setSuccess(() => false);
    setHasAnswered(() => false);
    setCompletedTasks(() => completedTasks + 1);
    setCurrentTask(() => currentTask + 1);
    setColors(() => sortedColors.sort(() => Math.random() - 0.5));
    setStartTime(() => new Date().getTime());
  }

  /*
   * This function generate the html code for all the options of a question
   *
   * @return {String} - The html code for the options
   */
  const getOptions = () => {
    if(startTime === 0) {
      setStartTime(() => new Date().getTime());
    }

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
      option.time = new Date().getTime() - startTime;
      setSuccess(() => option.correct);
      setHasAnswered(() => true);
      let selection = responses;
      localStorage.setItem('completedTasks', JSON.stringify(completedTasks + 1));
      setStartTime(() => 0);
      selection.answers[taskId] = option;
      setResponses(() => selection);
      localStorage.setItem('responses', JSON.stringify(selection));
    }
  }

  return (
      <>
        {(currentTask < 20 && questions.questions) ? getOptions() : <div className="App"><div className="container"><h2>Loading...</h2></div></div>}
      </>
  );
}

export default App;
