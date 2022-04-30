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

module.exports = Option;
