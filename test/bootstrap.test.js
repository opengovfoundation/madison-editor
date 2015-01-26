var Sails = require('sails'),
  sails;

// Path wrapper helper.
global.path = function(name) {
    return __dirname + '/../api/' + name;
}

// before(function(done) {
//   Sails.lift({
//     // configuration for testing purposes
//   }, function(err, server) {
//     sails = server;
//     if (err) return done(err);
//     // here you can load fixtures, etc.
//     done(err, sails);
//   });
// });

// after(function(done) {
//   // here you can clear fixtures, etc.
//   sails.lower(done);
// });
