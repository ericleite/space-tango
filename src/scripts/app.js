'use strict';

class App {
  constructor() {
    console.log('App initialized.');
  }

  log(msg) {
    console.log(msg);
  }
}

module.exports = new App();
