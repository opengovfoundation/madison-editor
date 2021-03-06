module.exports = {
  /**
   * index() - list all users.
   */
  index: function(req, res) {

    if(!req.session || !req.session.user || !req.session.user.id) {
      return res.badRequest('Unauthorized.');
    }

    var page=req.param('page', 1);
    var limit=req.param('limit', null);
    var filters = {
      'is_template': req.param('is_template', 0)
    };

    // Use a promise to get both queries in parallel.
    // We return the promise so we can test this.
    return Promise.all([
      User.find(),
      User.count()
    ]).spread(function(users, count) {
      // Get all of our results.
      return res.json({
        page: page,
        limit: limit,
        count: count.count,
        users: users
      });
    }).catch(function(error) {
      // Handle any errors - this occurs on
      // the *first* error.
      return res.badRequest(error);
    });
  },
  /**
   * find() - find a single user by its id.
   */
  find: function(req, res) {
    if(!req.session || !req.session.user || !req.session.user.id) {
      return res.badRequest('Unauthorized.');
    }

    var isNumeric = /^\d+$/;
    if(!isNumeric.test(req.session.user.id) || !isNumeric.test(req.param('id'))) {
      return res.badRequest('Id is not valid.');
    }

    User.findOne({'id': req.param('id')}).then(function(user) {
      return res.json(user);
    }).catch(function(error) {
      return res.badRequest(error);
    });
  },
  /**
   * create() - create a new user.
   */
  create: function(req, res) {
    var user = req.param('user');

    // Todo: Do user setup here.
    User.create(user, function(error, user) {
      if(error) {
        res.badRequest(error);
      }
      else {
        res.json(user);
      }
    });
  },
  /**
   * update() - edit a user.
   */
  update: function(req, res) {
    User.findOne({id: req.param('id')}).exec(function(error, user) {
      if(user){
        // Todo: error checking.
        var newUser = req.param('user');
        console.log('preupdate data', newUser);

        for(param in newUser) {
          user[param] = newUser[param];
        }
        user.save(function(error, result) {
          if(error) {
            res.badRequest(error);
          }
          else {
            res.json(result);
          }
        });
      }
      else {
        res.badRequest(error);
      }
    });
  },
  /**
   * destroy() - remove a user.
   */
  destroy: function(req, res) {
    // Todo: error checking.
    User.destroy({id: req.param('id')}).exec(function(error) {
      // Delete the etherpad for this user.
      EtherpadService.deletePad({padID: req.param('id')});

      if(error) {
        res.badRequest(error);
      }
      else {
        res.ok();
      }
    });
  },

  /*
   * findCurrent - get info about the current user.
   */
  findCurrent: function(req, res) {
    if(req.session && req.session.passport && req.session.passport.user) {
      // Update the current user in the session and send it back.
      User.findOne({ id: req.session.passport.user.id })
        .exec(function(error, user) {
        if(user) {
          user.display_name = user.fname + ' ' + user.lname;

          return res.json(user);
        }
        else {
          return res.badRequest(error);
        }
      });
    }
    else {
      return res.forbidden();
    }
  },

  /*
   * updateCurrent - update info about the current user.
   */
  updateCurrent: function(req, res) {
    if(req.session && req.session.passport && req.session.passport.user) {
      // TODO: Find user

      if(user) {
        var newUser = req.param('user');
        for(param in newUser) {
          user[param] = newUser[param];
        }
        // TODO: Update user

        return res.json(req.session.passport.user);
      }
      else {
          return res.badRequest();
      }
    }
    else {
      return res.forbidden();
    }
  }
};
