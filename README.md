# Madison Editor

[![Build Status](https://travis-ci.org/opengovfoundation/madison-editor.svg?branch=issue48)](https://travis-ci.org/opengovfoundation/madison-editor)

The Madison Editor is our main document drafting platform for [Madison](https://github.com/opengovfoundation/madison).  It allows lawmakers to create new legislation and share it for collaboration with their partners, before publishing it on the main Madison site.

This is a [Node](https://nodejs.org/en/) + [Sails.js](http://sailsjs.org/) application with [AngularJS](https://angularjs.org/) on the frontend, running [Etherpad](https://github.com/ether/etherpad-lite) as the main editing tool.

# Getting Started

1. Clone the repo
2. Run `npm install` to get the node packages.
3. Run `bower install` from the `assets` directory to get the bower packages.
4. Create a new database for the application.  *Note:* Currently, an instance of Madison is necessary, so you'll need an existing Madison database to connect to.
5. Set your configuration options in the `config/env` folder, including the database connection in `development.js`.
6. Run `sails lift` to start the application.

You'll also need a running [Etherpad](https://github.com/ether/etherpad-lite) instance for the actual editing window.
