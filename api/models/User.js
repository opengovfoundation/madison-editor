var bcrypt = require('bcryptjs');

var User = {
  tableName: 'users',

  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    //username  : { type: 'string', unique: true },
    email     : { type: 'email', unique: true },
    password  : { type: 'string', protected: true },
    fname  : { type: 'string' },
    lname  : { type: 'string' },
    address1: { type: 'string' },
    address2: { type: 'string' },
    city: { type: 'string' },
    state: { type: 'string' },
    postal_code: { type: 'string' },
    phone: { type: 'string' },
    url: { type: 'string' },
    last_login: { type: 'datetime' },
    created_at: { type: 'datetime' },
    updated_at: { type: 'datetime' },
    deleted_at: { type: 'datetime' },
    //passports : { collection: 'Passport', via: 'user' },

    /**
     * Validate password used by the local strategy.
     *
     * @param {string}   password The password to validate
     * @param {Function} next
     */
    validatePassword: function (password, next) {
      bcrypt.compare(password, this.password, next);
    }
  },

  autoCreatedAt: false,
  autoUpdatedAt: false
};

module.exports = User;
