module.exports = {

	api: {},

	registerCollection: function (collection, cb) {
		this.api = require('etherpad-lite-client');
		this.api.connect({
			apikey: collection.config.apikey,
			host: collection.config.host,
			port: collection.config.port
		});
		cb();
	},

	instance: function() {
		return this.api;
	}

};
