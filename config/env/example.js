/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

var express = require('../../node_modules/sails/node_modules/express'),
MySQLSessionStore = require('node-laravel-mysql-session');

var database  = 'database',
    user      = 'user',
    password  = 'password',
    port      = 3306;

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  connections: {
    mysqlServer: {
      adapter: 'sails-mysql',
      host: 'localhost',
      database: database,
      user: user,
      password: password
    },
    etherpad: {
      apikey: 'apikey',
      host: 'localhost',
      port: '9001'
    }
  },
  session: {
    cookie: {
      domain: '.mymadison.io'
    },
    store: new (MySQLSessionStore(express))(database, user,
      password, { host: 'localhost', port: port, connectionLimit: 0, pool: false})
  }
};
