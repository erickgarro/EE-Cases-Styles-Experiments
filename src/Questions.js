/**
 * Experimentation & Evaluation SP2022
 * USI - Università della Svizzera italiana
 * Project: Cases Styles Experiments
 *
 * Authors: Erick Garro Elizondo & Cindy Guerrero Toro
 */

import Option from './experiment/Option';

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
 * @returns {Questions[]} - Array of questions.
 */
export default function createQuestions() {
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
  return questions;
}
