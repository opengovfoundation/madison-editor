var api = require('etherpad-lite-client')

var etherpad = api.connect(sails.config.connections.etherpad)
etherpad.api = api;

module.exports = etherpad;
