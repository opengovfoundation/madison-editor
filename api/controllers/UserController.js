module.exports = {
  /*
   * findCurrent - get info about the current user.
   */
  findCurrent: function(req, res) {
    if(req.session && req.session.passport && req.session.passport.user) {
      // Update the current user in the session and send it back.
      User.findOne({ id: req.session.passport.user.id })
        .exec(function(error, user) {
        if(user) {
          return res.ok(user.toJSON());
        }
        else {
          return res.forbidden();
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
      if(user) {
        var newDoc = req.param('user');
        for(param in newDoc) {
          document[param] = newDoc[param];
        }
      }
      else {
          return res.forbidden();
      }

      return res.json(req.session.passport.user);
    }
    else {
      return res.forbidden();
    }
  }
};
