/**
 * Experimentation & Evaluation SP2022
 * USI - Università della Svizzera italiana
 * Project: Cases Styles Experiments
 *
 * Authors: Erick Garro Elizondo & Cindy Guerrero Toro
 */

import './App.css';
import { useState, useEffect } from "react";

require('typeface-open-sans')

const server = process.env.REACT_APP_SERVER;
// const server = process.env.REACT_APP_LOCAL_SERVER;

let userTemplate = {
  userId: '',
  age: 0,
  gender: '',
  background: '',
  gaveConsent: true
};

let responsesTemplate = {
  user: userTemplate,
  answers: {}
};

let sortedColors = ['word1', 'word2', 'word3'];

/*
 * This is the main component of the application.
 * It is the entry point of the application.
 */
function App() {
  const [questions, setQuestions] = useState({});
  const [tutorial, setTutorial] = useState({});
  const [completedTasks, setCompletedTasks] = useState(0);
  const [completedTutorialTasks, setCompletedTutorialTasks] = useState(0);
  const [currentTask, setCurrentTask] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [currentStage, setCurrentStage] = useState('intro');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [background, setBackground] = useState('');
  const [consent, setConsent] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [responses, setResponses] = useState(responsesTemplate);
  const [colors, setColors] = useState(() => sortedColors.sort(() => Math.random() - 0.5));


  useEffect(() => {
    if (localStorage.getItem('isDone') === null) {
      localStorage.setItem('isDone', 'false');
    }
    // check if currentStage is in localStorage
    if (localStorage.getItem('currentStage') === null) {
      localStorage.setItem('currentStage', 'intro');
      setCurrentStage(() => 'intro');
    } else {
      setCurrentStage(() => localStorage.getItem('currentStage'));
    }
  }, []);

  useEffect(() => {
    if (isDone) { // handle the fact that in the current implementation competedTasks is incremented when 'continue' is clicked
      async function submitResponses() {
        const response = await fetch(`${server}/responses/submit/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(responses)
        });
        const data = await response.json();
        console.log(data);

        if (data.status === 200) {
          // delete (almost) all the localStorage
          localStorage.setItem('isDone', 'true');
          localStorage.setItem('currentStage', 'done');

          localStorage.removeItem('currentTask');
          localStorage.removeItem('questions');
          localStorage.removeItem('completedTasks');
          localStorage.removeItem('completedTutorialTasks');
          localStorage.removeItem('responses');
          localStorage.removeItem('tutorial');
        }
      }

      submitResponses().then(() => {
        console.log('Submitted');
      });
    }
  }, [completedTasks, responses, userId, isDone]);

  useEffect(() => {
    // look for userId in localStorage
    if (localStorage.getItem('userId')) {
      setUserId(() => localStorage.getItem('userId'));
    } else {
      // if not found, generate a new one
      const newUserId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('userId', newUserId);
      setUserId(() => newUserId);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('completedTutorialTasks', '0');
    setCompletedTutorialTasks(() => 0);

    if (localStorage.getItem('userId')) {
      const id = localStorage.getItem('userId');

      if (localStorage.getItem('tutorial')) {
        setTutorial(() => JSON.parse(localStorage.getItem('tutorial')));
      } else {
        // if not found, fetch questions from server
        async function fetchData() {
          const response = await fetch(server + '/tutorial/get/' + id);
          const data = await response.json();
          localStorage.setItem('tutorial', JSON.stringify(data));
          setTutorial(data);
        }

        fetchData().then(r => console.log(r));
      }

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
      setResponses(() => JSON.parse(localStorage.getItem('responses')));
    }
    //check if there are already completed tasks in localStorage
    if (localStorage.getItem('completedTasks')) {
      setCompletedTasks(() => JSON.parse(localStorage.getItem('completedTasks')));
    }

    // check if there is already a user in currentTask
    if (localStorage.getItem('currentTask')) {
      setCurrentTask(() => JSON.parse(localStorage.getItem('currentTask')));
      localStorage.setItem('currentTask', JSON.stringify(currentTask));
    }
  }, [currentTask]);

  /*
   * This function generate the html code for one option of a question
   *
   * @param {Object} option - The option to generate the html code
   * @param {Number} index - The index of the option
   * @return {String} - The html code for the option
   */
  const getOneOption = (option, colorType, colors, caseStyle) => {
    return (
      <div key={option.id} className='option'>
        <button className={`option ${hasAnswered ? `${(option.correct) ? 'correct' : 'wrong'}` : ''}`} onClick={() => handleWordSelection(option, currentTask + 1)}>
          <span className={`${colorType === 'chromatic' ? colors[0] : ''}`}>{option.words[0]}</span>
          {(caseStyle === 'kebab') ?
            <span className={(colorType === 'chromatic' && caseStyle === 'kebab') ? 'hyphen' : ''}>-</span> : ''}
          <span className={`${colorType === 'chromatic' ? colors[1] : ''}`}>{option.words[1]}</span>
          {(option.words.length > 2 && caseStyle === 'kebab') ?
            <span className={(colorType === 'chromatic' && caseStyle === 'kebab') ? 'hyphen' : ''}>-</span> : ''}
          {option.words.length === 3 &&
           <span className={`${colorType === 'chromatic' ? colors[2] : ''}`}>{option.words[2]}</span>}
        </button>
      </div>
    );
  }

  /*
   * This function generate the html code for the next question (words)
   *
   * @return {String} - The html code for the next question
   */
  const getNextWords = () => {
    setSuccess(() => false);
    setHasAnswered(() => false);
    setCurrentTask(() => currentTask + 1);
    localStorage.setItem('currentTask', JSON.stringify(currentTask));
    setColors(() => sortedColors.sort(() => Math.random() - 0.5));
    setStartTime(() => new Date().getTime());

    if (currentStage === 'tutorial' && completedTutorialTasks < tutorial.questions.length) {
      if (completedTutorialTasks + 1 === 20) {
        localStorage.setItem('isDone', JSON.stringify(true));
      }
      setCompletedTutorialTasks(() => completedTutorialTasks + 1);
    } else {
      setCompletedTasks(() => completedTasks + 1);
    }
  }

  /*
   * This function controls the active stage
   *
   * @return {String} - The html code for the next stage
   */
  function nextStageController() {
    switch (currentStage) {
      case 'intro':
        setCurrentStage(() => 'tutorial-intro');
        localStorage.setItem('currentStage', 'tutorial-intro');
        break;
      case 'tutorial-intro':
        setCurrentStage(() => 'tutorial');
        localStorage.setItem('currentStage', 'tutorial');
        break;
      case 'tutorial':
        setCurrentStage(() => 'tutorial-outro');
        localStorage.setItem('currentStage', 'tutorial-outro');
        break;
      case 'tutorial-outro':
        setCurrentStage(() => 'experiments');
        localStorage.setItem('currentStage', 'experiments');
        setCurrentTask(() => 0);
        setCompletedTasks(() => 0);
        localStorage.setItem('currentTask', JSON.stringify(0));
        localStorage.setItem('completedTasks', JSON.stringify(0));
        break;
      case 'experiments':
        setCurrentStage(() => 'done');
        localStorage.setItem('currentStage', 'done');
        break;
      default:
        break;
    }
  }

  /*
   * This function resets the state of the tutorial
   */
  function restartTutorial() {
    setCompletedTutorialTasks(() => 0);
    setCurrentTask(() => 0);
    localStorage.setItem('currentTask', JSON.stringify(currentTask));
    setHasAnswered(() => false);
    setSuccess(() => false);
    setColors(() => sortedColors.sort(() => Math.random() - 0.5));
    // Randomize options per question
    const tutorialCopy = JSON.parse(JSON.stringify(tutorial));
    tutorialCopy.questions.forEach(question => {
      question.options.sort(() => Math.random() - 0.5);
    });
    localStorage.setItem('tutorial', JSON.stringify(tutorialCopy));
    localStorage.setItem('completedTutorialTasks', 0);
    setTutorial(() => tutorialCopy);
  }

  /*
   * This function resets the state of the tutorial and sets the current stage to experiment
   */
  function finishTutorial() {
    localStorage.setItem('completedTasks', '0');
    setCompletedTasks(() => 0);
    setHasAnswered(() => false);
    localStorage.setItem('completedTutorialTasks', 0);
    nextStageController();
  }

  function copyToClipboard(href) {
    const tempInput = document.createElement('input');
    tempInput.value = href;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  }

  function shareViaEmail() {
    const href = window.location.href;
    const subject = 'Check out this experiment!';
    const body = `Hey, just completed this cool experiment from some students at USI! Check it out: ${href}`;
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  }

  function shareViaWhatsapp() {
    const href = window.location.href;
    const body = `Hey, just completed this cool experiment from some students at USI! Check it out: ${href}`;
    window.open(`whatsapp://send?text=${body}`, '_blank');
  }

  /*
   * This function generate the html code for all the options of a question
   *
   * @return {String} - The html code for the options
   */
  const getOptions = () => {
    if (startTime === 0) {
      setStartTime(() => new Date().getTime());
    }
  };
  /*
   * This function generate the html code for the introduction of the experiment
   *
   * @return {String} - The html code for the introduction of the experiment
   */
  const getIntro = () => {
    return (
      <div className="intro-container">
        <div className="header">
          <h2>Welcome to our experiment</h2>
        </div>
        <div className="text">
          <p> We thank you for taking the time to join.</p>
          <h4>This study focuses on the readability of text and should
            not take more than 5-10 minutes to complete.</h4>
          <h2>Informed consent</h2>

          <div className="notice">
            <p>We will record the information you might provide us in the dropdowns below and your answers to the tasks you will complete; none of which can be traced back to you.</p>
            <p>We place a randomly generated ID in your browser to manage your interaction with the experiment, researchers the results, and avoid duplicated participation.</p>
            <p>Only upon finalizing all the tasks, the results and the anonymized data will be transmitted to us automatically.</p>
          </div>
          <h4>You may leave the experiment at any time. No strings attached.</h4>

          <p>You can even come back and resume where you left off<br />(assuming the study is still running ;-)</p>
        </div>
        <div>
          <p className="info">This research is done as part of the Experimentation and Evaluation course of the BSc in Informatics at the Università della Svizzera italiana (USI) in Lugano, Switzerland.</p>

          <select id="age" className={`drop-down ${consent && age === '' ? 'drop-down-missing' : ''}`} required onChange={(e) => {
            setAge(() => e.target.value);
            let selection = responses;
            selection.user.age = e.target.value;
            setResponses(() => selection);
            localStorage.setItem('responses', JSON.stringify(selection));
          }}
          >
            <option value="">What is your age?</option>
            <option value="17-">17 or less</option>
            <option value="18-24">18-24</option>
            <option value="25-34">25-34</option>
            <option value="35-44">35-44</option>
            <option value="45-54">45-54</option>
            <option value="55-64">55-64</option>
            <option value="65+">65+</option>
            <option value="n/a">Prefer not to say</option>
          </select>
          <select id="gender" className={`drop-down ${consent && gender === '' ? 'drop-down-missing' : ''}`} required onChange={(e) => {
            setGender(() => e.target.value);
            let selection = responses;
            selection.user.gender = e.target.value;
            setResponses(() => selection);
            localStorage.setItem('responses', JSON.stringify(selection));
          }}
          >
            }}>
            <option value="">What is your gender?</option>
            <option value="f">Female</option>
            <option value="m">Male</option>
            <option value="nbt">Non-binary / third gender</option>
            <option value="n/a">Prefer not to say</option>
          </select>
          <select id="background" className={`drop-down ${consent && background === '' ? 'drop-down-missing' : ''}`} required onChange={(e) => {
            setBackground(() => e.target.value);
            let selection = responses;
            selection.user.background = e.target.value;
            setResponses(() => selection);
            localStorage.setItem('responses', JSON.stringify(selection));
          }}
          >
            <option value="">What is your background?</option>
            <option value="csu">Computer science undergraduate</option>
            <option value="csg">Computer science graduate</option>
            <option value="hcs">High school student</option>
            <option value="ofu">Other fields undergraduate</option>
            <option value="ofg">Other fields graduate</option>
            <option value="wo">Without post-secondary studies</option>
            <option value="n/a">Prefer not to say</option>
          </select>
        </div>
        <div className="consent">
          <div className="consent-checkbox">
            <input type="checkbox" id="consent" name="consent" required onChange={() => {
              setConsent(() => !consent);
            }}
            />
            <label htmlFor="consent">I agree to participate in this study and grant the researchers permission to process the information I am providing.</label>
          </div>
        </div>
        <div className="button">
          <div className="action">
            <button className="continue" disabled={(!consent || age === '' || gender === '' || background === '')} onClick={() => nextStageController()}>Continue</button>
          </div>
        </div>
        <div className="notice">
          <p>Experiment by Erick Garro and Cindy Guerrero.</p>
        </div>
      </div>
    )
  };

  /*
   * This function generate the html code for the tutorial intro
   *
   * @return {String} - The html code for the tutorial intro
   */
  const getTutorialIntro = () => {
    return (
      <div className="intro-container">
        <div className="header">
          <h2>Quick tutorial</h2>
        </div>
        <div className="text">
          <h4>Steps</h4>
          {/*numbered list of 3 steps  */}
          <ol className="steps">
            <li>
              <p>
                <span>After you click the button 'start tutorial,' some words will appear on the top part of the screen. </span>
              </p>
            </li>
            <li>
              <p>
                <span>You will need to find the exact match of words among four options in the central part of the screen.</span>
              </p>
            </li>
            <li>
              <p>
                <span>When you find it, select it right away.</span>
              </p>
            </li>
            <li>
              <p>
                <span>A 'continue' button will appear. Select it when you are ready for the next one.</span>
              </p>
            </li>
          </ol>
        </div>
        <div className="info">
          <h4>Whenever you are ready, go ahead and start our short tutorial.</h4>
        </div>
        <div className="button">
          <div className="action">
            <button className="continue" onClick={() => nextStageController()}>Start tutorial</button>
          </div>
        </div>
        <div className="notice">
        </div>
      </div>
    )
  };

  /*
   * This function generate the html code for the tutorial outro
   *
   * @return {String} - The html code for the tutorial outro
   */
  const getTutorialOutro = () => {
    return (
      <div className="intro-container">
        <div className="header">
        </div>
        <div className="text">

        </div>
        <div className="info">
        </div>
        <div className="button">
          <h1>The experiment is about to begin!</h1>
          <h3>Now comes the real deal.</h3>
          <h3>We are ready whenever you are.</h3>

          <div className="action">
            <button className="continue" onClick={() => nextStageController()}>Start now</button>
          </div>
        </div>
        <div className="notice">
        </div>
      </div>
    )
  };

  /*
   * This function generate the html code for the tutorial outro
   *
   * @return {String} - The html code for the tutorial outro
   */
  const getIsDone = () => {
    return (
      <div className="intro-container">
        <div className="header">
        </div>
        <div className="text">

        </div>
        <div className="info">
          <h1>Thank you for your support!</h1>
          <h3>Your results were already transmitted to us.</h3>

        </div>
        <div className="button">
          <h2>We hope you had fun!</h2>
          <p>Please consider sharing our experiment</p>
          <button className="continue" onClick={() => copyToClipboard(window.location.href)}>Copy URL</button>
          <button className="continue" onClick={() => shareViaWhatsapp()}>Share via WhatsApp</button>
          <button className="continue" onClick={() => shareViaEmail()}>Share via email</button>

        </div>
        <div className="notice">
          <p>You can now close this window.</p>
        </div>
      </div>
    )
  };

  /*
   * This function generate the html code for the experiments
   *
   @return {String} - The html code for the experiments
   */
  function getExperiments() {
    return (
      <div className="experiments-container">
        <div className="control">
          <p>{currentStage === 'experiments' ? 'Experiment task' : 'Tutorial task'} {currentStage === 'experiments' ? completedTasks + 1 : completedTutorialTasks + 1} of {currentStage === 'experiments' ? questions.questions.length : tutorial.questions.length}</p>
        </div>
        <div className="words">
          <>
            <h1>{currentStage === 'tutorial' ? tutorial.questions[currentTask].words.join(' ') : ''}</h1>
            <h1>{currentStage === 'experiments' ? questions.questions[completedTasks].words.join(' ') : ''}</h1>
          </>
        </div>
        <div>
          <h2 className="statement">Can you spot the words?</h2>
        </div>
        <div className="answers">
          <div className='options-container'>

            {/* Either map tutorials pr questions Map through the questions and get the options */}
            {currentStage === 'experiments' ?
              questions.questions[currentTask].options.map(option => {
                return getOneOption(option, questions.questions[currentTask].color, colors, questions.questions[currentTask].caseStyle);
              })
              :
              tutorial.questions[currentTask].options.map(option => {
                return getOneOption(option, tutorial.questions[currentTask].color, colors, tutorial.questions[currentTask].caseStyle);
              })
            }
          </div>
        </div>

        {success ?
          <div>
            <p className={`feedback ${!hasAnswered ? 'hidden' : ''}`}>Well done!</p>
            <br />
            <p className={`feedback ${localStorage.getItem('completedTutorialTasks') <= 2 ? 'hidden' : ''}`}>If you feel ready, move on to the next stage.</p>
          </div> :
          <div>
            <p className={`feedback ${!hasAnswered ? 'hidden' : ''}`}>Oops! Not quite right.</p>
            <br />
            <p className={`feedback ${localStorage.getItem('completedTutorialTasks') <= 2 ? 'hidden' : ''}`}>Ok, it wasn't perfect, but we can proceed.</p>
            <br />
            <p className={`feedback ${completedTasks >= 19 && hasAnswered ? '' : 'no-display'}`}>You completed all the tasks. Please click to finish the experiment</p>

          </div>}


        <div className="action">
          <button className={`continue-secondary ${currentStage === 'tutorial' && localStorage.getItem('completedTutorialTasks') > 2 ? '' : 'no-display'}`} onClick={() => restartTutorial()}>Try tutorial again</button>
          <button className={`continue ${completedTasks < 19 && hasAnswered ? '' : 'no-display'} ${localStorage.getItem('completedTutorialTasks') >= tutorial.questions.length ? 'no-display' : ''}`} onClick={() => getNextWords()}>Continue</button>
          <button className={`continue ${completedTasks >= 19 && hasAnswered ? '' : 'no-display'}`} onClick={() => nextStageController()}>Send results</button>
          <button className={`continue ${currentStage === 'tutorial' && localStorage.getItem('completedTutorialTasks') > 2 ? '' : 'no-display'}`} onClick={() => finishTutorial()}>Continue to experiment</button>
        </div>
        <div className="footer">
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {currentStage === 'intro' ? getIntro() : ''}
      {currentStage === 'tutorial-intro' ? getTutorialIntro() : ''}
      {currentStage === 'tutorial' ? getExperiments() : ''}
      {currentStage === 'tutorial-outro' ? getTutorialOutro() : ''}
      {currentStage === 'experiments' ? getExperiments() : ''}
      {currentStage === 'done' ? getIsDone() : ''}
      {currentTask > 20 ? getIsDone() : ''}
    </div>
  )

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

      if (selection.user.userId === '') {
        selection.user.userId = localStorage.getItem('userId');
      }

      if (currentStage === 'experiments') {
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks + 1));
        setStartTime(() => 0);
        selection.answers[option.id.split('.')[0]] = option;
        setResponses(() => selection);
        localStorage.setItem('responses', JSON.stringify(selection));
        if (completedTasks === 19) {
          setIsDone(true);
        }
      } else {
        localStorage.setItem('completedTutorialTasks', JSON.stringify(completedTutorialTasks + 1));
      }


      return (
        <>
          {(completedTasks <= 20 && questions.questions) ? getOptions() : <div className="App">
            <div className="container"><h2>Loading...</h2></div>
          </div>}
        </>
      );
    }
  }
}


  export default App;
