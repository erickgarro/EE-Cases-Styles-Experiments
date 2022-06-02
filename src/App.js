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

// const server = process.env.REACT_APP_SERVER;
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
    if (isDone) { // handle the fact that in the current implementation competedTasks is incremented when 'continue' is          localStorage.setItem('isDone', 'true');
      // localStorage.setItem('currentStage', 'done');
      localStorage.removeItem('isDone');
      localStorage.removeItem('currentTask');
      localStorage.removeItem('questions');
      localStorage.removeItem('completedTasks');
      localStorage.removeItem('completedTutorialTasks');
      localStorage.removeItem('responses');
      localStorage.removeItem('tutorial');
      localStorage.removeItem('userId');
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

    /**
     * Experimentation & Evaluation SP2022
     * USI - Università della Svizzera italiana
     * Project: Cases Styles Experiments
     *
     * Authors: Erick Garro Elizondo & Cindy Guerrero Toro
     */

    /*
     * Class: Option
     * This class is responsible for the options of the questions.
     * Every option has an id, an array of words, a boolean value indicating if it is correct or not.
     */
    class Option {
      constructor(id, words, correct) {
        this.id = id;
        this.words = words;
        this.correct = correct;
      }

      // getters
      getId() {
        return this.id;
      }

      getWords() {
        return this.words;
      }

      getCorrect() {
        return this.correct;
      }

      // setters
      setId(id) {
        this.id = id;
      }

      setWords(words) {
        this.words = words;
      }

      setCorrect(correct) {
        this.correct = correct;
      }
    }

    /*
     * Class: Questions
     * This class is responsible for the questions of the experiment.
     * Every question has an id, an array words, a case style, color, an array of options.
     * The options are the possible answers to the question.
     *
     */
    class Questions {
      constructor(id, words, caseStyle, color, options) {
        this.id = id;
        this.words = words;
        this.caseStyle = caseStyle;
        this.color = color;
        this.options = options;
      }

      // getters
      getId() {
        return this.id;
      }

      getWords() {
        return this.words;
      }

      getCaseStyle() {
        return this.caseStyle;
      }

      getColor() {
        return this.color;
      }

      getOptions() {
        return this.options;
      }

      /*
       * This method gets an array with the sum of the length of each option's words
       * in case it is a kebab case it joins the words with a dash, else it joins the words.
       *
       * @returns {Array} - Array with the sum of the length of each option's words
       */
      getSumOfOptionsLength() {
        let lengths = [];

        this.options.forEach(option => {
          if (this.caseStyle === 'kebab') {
            lengths.push(option.getWords().join('-').length);
          } else {
            lengths.push(option.getWords().join('').length);
          }
        });
        return lengths;
      }

      // setters
      setId(id) {
        this.id = id;
      }

      setWords(words) {
        this.words = words;
      }

      setCaseStyle(caseStyle) {
        this.caseStyle = caseStyle;
      }

      setColor(color) {
        this.color = color;
      }

      setOptions(options) {
        this.options = options;
      }

      // method: get an array with length of each word option
      getLengthOptions() {
        let lengthOptions = [];
        for (let i = 0; i < this.options.length; i++) {
          lengthOptions.push(this.options[i].length);
        }
        return lengthOptions;
      }

    }

    /* This function shuffles the order of the content of an array
     *
     * @param {Array} array - Array to be shuffled
     * @returns {Array} - Shuffled array
     */
    function shuffleArray(array) {
      let currentIndex = array.length,
        temporaryValue,
        randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }


    /*
     * This method is responsible for the creation of the questions.
     * It returns an array of questions.
     *
     * @param {string} _userId - User id
     * @returns {Questions[]} - Array of questions.
     */
    function createQuestions(_userId) {
      let userId = _userId;
      let questions = [];
      let options = [];
      let words = [];
      let caseStyle = undefined;
      let color = undefined;

      // Kebab Case - Monochromatic
      // Question 1
      words = ["telotaxi", "is", "sour"];
      caseStyle = "kebab";
      color = "monochromatic";
      options = [
        new Option(1 + '.' + 1, ["telotaxi","is","sour"], true),
        new Option(1 + '.' + 2, ["tropotaxi","is","sour"], false),
        new Option(1 + '.' + 3, ["telotaxi","if","soup"], false),
        new Option(1 + '.' + 4, ["telophase","is","sour"], false),
      ];
      options = shuffleArray(options);
      questions.push(new Questions('1', words, caseStyle, color, options));

      // Question 2
      words = ["vinyl","paint"];
      caseStyle = "kebab";
      color = "monochromatic";
      options = [
        new Option(2 + '.' + 1, ["vinyl","paint"], true),
        new Option(2 + '.' + 2, ["vinyl","plant"], false),
        new Option(2 + '.' + 3, ["vinyl","taint"], false),
        new Option(2 + '.' + 4, ["vinyl","saint"], false),
      ];
      options = shuffleArray(options);
      questions.push(new Questions('2', words, caseStyle, color, options));

      // Question 3
      words = ["handy","dandy"];
      caseStyle = "kebab";
      color = "monochromatic";
      options = [
        new Option(3 + '.' + 1, ["handy","dandy"], true),
        new Option(3 + '.' + 2, ["candy","dandy"], false),
        new Option(3 + '.' + 3, ["handy","sandy"], false),
        new Option(3 + '.' + 4, ["handy","cindy"], false),
      ];
      options = shuffleArray(options);
      questions.push(new Questions('3', words, caseStyle, color, options));

      // Question 4
      words = ["file","not","found"];
      caseStyle = "kebab";
      color = "monochromatic";
      options = [
        new Option(4 + '.' + 1, ["file","not","found"], true),
        new Option(4 + '.' + 2, ["fine","not","found"], false),
        new Option(4 + '.' + 3, ["file","hot","found"], false),
        new Option(4 + '.' + 4, ["file","not","sound"], false),
      ];
      options = shuffleArray(options);
      questions.push(new Questions('4', words, caseStyle, color, options));

      // Question 5
      words = ["brew","coffee","now"];
      caseStyle = "kebab";
      color = "monochromatic";
      options = [
        new Option(5 + '.' + 1, ["brew","coffee","now"], true),
        new Option(5 + '.' + 2, ["brew","coffee","meow"], false),
        new Option(5 + '.' + 3, ["draw","coffee","now"], false),
        new Option(5 + '.' + 4, ["brew","toffee","now"], false),
      ];
      options = shuffleArray(options);
      questions.push(new Questions('5', words, caseStyle, color, options));

      // Kebab Case - Chromatic
      // Question 6
      words = ["asphyxy","cloud"];
      caseStyle = "kebab";
      color = "chromatic";
      options = [
        new Option(6 + '.' + 1, ["asphyxy","cloud"], true),
        new Option(6 + '.' + 2, ["cataplexy","cloud"], false),
        new Option(6 + '.' + 3, ["apoplexy","loud"], false),
        new Option(6 + '.' + 4, ["apoplexy","cloud"], false),
      ];
      options = shuffleArray(options);
      questions.push(new Questions('6', words, caseStyle, color, options));

      // Question 7
      words = ["narrow","polyphone"];
      caseStyle = "kebab";
      color = "chromatic";
      options = [
        new Option(7 + '.' + 1, ["narrow","polyphone"], true),
        new Option(7 + '.' + 2, ["narrow","polyphase"], false),
        new Option(7 + '.' + 3, ["marrons","polyphagia"], false),
        new Option(7 + '.' + 4, ["marrows","polyphone"], false),
      ];
      options = shuffleArray(options);
      questions.push(new Questions('7', words, caseStyle, color, options));

      // Question 8
      words = ["dark","side","guy"];
      caseStyle = "kebab";
      color = "chromatic";
      options = [
        new Option(8 + '.' + 1, ["dark","side","guy"], true),
        new Option(8 + '.' + 2, ["bark","side","gui"], false),
        new Option(8 + '.' + 3, ["dark","sine","buy"], false),
        new Option(8 + '.' + 4, ["dart","side","guy"], false),
      ];
      options = shuffleArray(options);
      questions.push(new Questions('8', words, caseStyle, color, options));

      // Question 9
      words = ["biotron","mnemonic"];
      caseStyle = "kebab";
      color = "chromatic";
      options = [
        new Option(9 + '.' + 1, ["biotron","mnemonic"], true),
        new Option(9 + '.' + 2, ["biotron","anemone"], false),
        new Option(9 + '.' + 3, ["biotin","mnemonic"], false),
        new Option(9 + '.' + 4, ["biotrin","anemone"], false),
      ];
      options = shuffleArray(options);
      questions.push(new Questions('9', words, caseStyle, color, options));

      // Question 10
      words = ["modal","horizontal","size"];
      caseStyle = "kebab";
      color = "chromatic";
      options = [
        new Option(10 + '.' + 1, ["modal","horizontal","size"], true),
        new Option(10 + '.' + 2, ["model","horizontal","size"], false),
        new Option(10 + '.' + 3, ["modal","horsiness","size"], false),
        new Option(10 + '.' + 4, ["medal","horizontal","size"], false),
      ];
      options = shuffleArray(options);
      questions.push(new Questions('10', words, caseStyle, color, options));

      // Camel Case - Monochromatic
      // Question 11
      words = ["sad","user"];
      caseStyle = "camel";
      color = "monochromatic";
      options = [
        new Option(11 + '.' + 1, ["sad","User"], true),
        new Option(11 + '.' + 2, ["sod","User"], false),
        new Option(11 + '.' + 3, ["sad","Suer"], false),
        new Option(11 + '.' + 4, ["set","User"], false),
      ];
      options = shuffleArray(options);
      questions.push(new Questions('11', words, caseStyle, color, options));

      // Question 12
      words = ["come","closer"];
      caseStyle = "camel";
      color = "monochromatic";
      options = [
        new Option(12 + '.' + 1, ["come","Closer"], true),
        new Option(12 + '.' + 2, ["cone","Closer"], false),
        new Option(12 + '.' + 3, ["come","Clover"], false),
        new Option(12 + '.' + 4, ["came","Closer"], false),
      ];
      options = shuffleArray(options);
      questions.push(new Questions('12', words, caseStyle, color, options));

      // Question 13
      words = ["rainbow","kid"];
      caseStyle = "camel";
      color = "monochromatic";
      options = [
        new Option(13 + '.' + 1, ["rainbow","Kid"], true),
        new Option(13 + '.' + 2, ["raining","Kid"], false),
        new Option(13 + '.' + 3, ["rainbow","Kit"], false),
        new Option(13 + '.' + 4, ["raymond","Kif"], false),
      ];
      options = shuffleArray(options);
      questions.push(new Questions('13', words, caseStyle, color, options));

      // Question 14
      words = ["has","golden","pass"];
      caseStyle = "camel";
      color = "monochromatic";
      options = [
        new Option(14 + '.' + 1, ["has","Golden","Pass"], true),
        new Option(14 + '.' + 2, ["hates","Gold","Pass"], false),
        new Option(14 + '.' + 3, ["has","Molten","Pass"], false),
        new Option(14 + '.' + 4, ["has","Golden","Path"], false),
      ];
      options = shuffleArray(options);
      questions.push(new Questions('14', words, caseStyle, color, options));

      // Question 15
      words = ["megatron","movies"];
      caseStyle = "camel";
      color = "monochromatic";
      options = [
        new Option(15 + '.' + 1, ["megatron","Movies"], true),
        new Option(15 + '.' + 2, ["negatron","Movies"], false),
        new Option(15 + '.' + 3, ["megatons","Movers"], false),
        new Option(15 + '.' + 4, ["megaton","Mavies"], false),
      ];
      options = shuffleArray(options);
      questions.push(new Questions('15', words, caseStyle, color, options));

      // Camel Case - Chromatic
      // Question 16
      words = ["eudemons","combo"];
      caseStyle = "camel";
      color = "chromatic";
      options = [
        new Option(16 + '.' + 1, ["eudemons","Combo"], true),
        new Option(16 + '.' + 2, ["eudaemons","Compo"], false),
        new Option(16 + '.' + 3, ["eudemons","Comae"], false),
        new Option(16 + '.' + 4, ["eudaemons","Combo"], false),
      ];
      options = shuffleArray(options);
      questions.push(new Questions('16', words, caseStyle, color, options));

      // Question 17
      words = ["electron","shower","night"];
      caseStyle = "camel";
      color = "chromatic";
      options = [
        new Option(17 + '.' + 1, ["electron","Shower","Night"], true),
        new Option(17 + '.' + 2, ["electric","Shower","Nighs"], false),
        new Option(17 + '.' + 3, ["electrode","Shower","Night"], false),
        new Option(17 + '.' + 4, ["electron","Showel","Night"], false),
      ];
      options = shuffleArray(options);
      questions.push(new Questions('17', words, caseStyle, color, options));

      // Question 18
      words = ["computerphobe","user"];
      caseStyle = "camel";
      color = "chromatic";
      options = [
        new Option(18 + '.' + 1, ["computerphobe","User"], true),
        new Option(18 + '.' + 2, ["computernik","User"], false),
        new Option(18 + '.' + 3, ["computerphobe","Uses"], false),
        new Option(18 + '.' + 4, ["computerphobed","Used"], false),
      ];
      options = shuffleArray(options);
      questions.push(new Questions('18', words, caseStyle, color, options));

      // Question 19
      words = ["quantum","daemon"];
      caseStyle = "camel";
      color = "chromatic";
      options = [
        new Option(19 + '.' + 1, ["quantum","Daemon"], true),
        new Option(19 + '.' + 2, ["quantum","Damian"], false),
        new Option(19 + '.' + 3, ["quantong","Denim"], false),
        new Option(19 + '.' + 4, ["quanting","Daemon"], false),
      ];
      options = shuffleArray(options);
      questions.push(new Questions('19', words, caseStyle, color, options));

      // Question 20
      words = ["has","not","paid"];
      caseStyle = "camel";
      color = "chromatic";
      options = [
        new Option(20 + '.' + 1, ["has","Not","Paid"], true),
        new Option(20 + '.' + 2, ["has","Never","Paid"], false),
        new Option(20 + '.' + 3, ["has","Now","Paid"], false),
        new Option(20 + '.' + 4, ["has","No","Path"], false),
      ];
      options = shuffleArray(options);
      questions.push(new Questions('20', words, caseStyle, color, options));

      shuffleArray(questions);

      return {
        userId: userId,
        questions: questions
      };
    }

    /*
     * This method is responsible for the creation of the questions for the tutorial
     * It returns an array of questions.
     *
     * @param {string} _userId - User id
     * @returns {Questions[]} - Array of questions.
     */
    function createTutorialQuestions(_userId) {
      let userId = _userId;
      let questions = [];
      let options = [];
      let words = [];
      let caseStyle = undefined;
      let color = undefined;

      // Question 1
      words = ["good", "mood"];
      caseStyle = "kebab";
      color = "monochromatic";
      options = [
        new Option(1 + '.' + 1, ["good", "mood"], true),
        new Option(1 + '.' + 2, ["goon", "moon"], false),
        new Option(1 + '.' + 3, ["goal", "mood"], false),
        new Option(1 + '.' + 4, ["good", "mono"], false),
      ];
      options = shuffleArray(options);
      questions.push(new Questions('1', words, caseStyle, color, options));

      // Question 2
      words = ["nice", "red", "cat"];
      caseStyle = "camel";
      color = "monochromatic";
      options = [
        new Option(2 + '.' + 1, ["nice", "Red", "Cat"], true),
        new Option(2 + '.' + 2, ["nice", "Led", "Cat"], false),
        new Option(2 + '.' + 3, ["nice", "Red", "Gat"], false),
        new Option(2 + '.' + 4, ["mice", "Red", "Cat"], false),
      ];
      options = shuffleArray(options);
      questions.push(new Questions('2', words, caseStyle, color, options));

      // Question 3
      words = ["move", "south"];
      caseStyle = "kebab";
      color = "chromatic";
      options = [
        new Option(3 + '.' + 1, ["move", "south"], true),
        new Option(3 + '.' + 2, ["moke", "south"], false),
        new Option(3 + '.' + 3, ["move", "souls"], false),
        new Option(3 + '.' + 4, ["mozo", "south"], false),
      ];
      options = shuffleArray(options);
      questions.push(new Questions('3', words, caseStyle, color, options));

      return {
        userId: userId,
        questions: questions
      };
    }



    if (localStorage.getItem('userId')) {
      const id = localStorage.getItem('userId');

      if (localStorage.getItem('tutorial')) {
        setTutorial(() => createTutorialQuestions(id));
      } else {
        // if not found, generate questions
        let tutorial = createTutorialQuestions(id)
        localStorage.setItem('tutorial', JSON.stringify(tutorial));
        setTutorial(tutorial);
      }

      if (localStorage.getItem('questions')) {
        setQuestions(JSON.parse(localStorage.getItem('questions')));
      } else {
        // if not found, genrate questions
        let questions = createQuestions(id)
        localStorage.setItem('questions', JSON.stringify(questions));
        setQuestions(questions);
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
            <p>We place a randomly generated ID in your browser to manage your interaction with the experiment to avoid duplicated participation.</p>
            <p>Only upon finalizing all the tasks, the results and the anonymized data will be transmitted to us automatically.</p>
          </div>
          <h4>You may leave the experiment at any time. No strings attached.</h4>

          <p>You can even come back and resume where you left off.</p>
          <p className="notice"><b>Note: That was the original text used during the research. You are now using a demo version that runs entirely on your browser, and we will not collect any information at all.</b></p>

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
            <option value="17-">11-17</option>
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
          <span>During the tutorial, you can change the zoom settings of your browser if the content on the screen is too big.</span>
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
