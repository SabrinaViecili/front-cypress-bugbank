const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://bugbank.netlify.app/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  "reporter": "../node_modules/mochawesome/src/mochawesome.js",
  "reporterOptions": {
      "overwrite": false,
      "html": false,
      "json": true
  }
});


