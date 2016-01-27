module.exports = {
  /**
   * index() - list all document types.
   */
  index: function(req, res) {
    return Promise.all([
      DocTypes.find(),
      DocTypes.count()
    ]).spread(function(types, count) {
      // Get all of our results.
      return res.json({
        types: types,
        count: count
      });
    }).catch(function(error) {
      // Handle any errors - this occurs on
      // the *first* error.
      return res.badRequest(error);
    });
  },
  /**
   * find() - find a single document type by its id.
   */
  find: function(req, res) {
    return DocTypes.find({id: req.param('id')}).then(function(type) {
      return res.json(type[0]);
    }).catch(function(error) {
      return res.badRequest(error);
    });
  },
  /**
   * create() - create a new document type.
   */
  create: function(req, res) {
    var docType = req.param('type');

    // Create a new promise to resolve when everything is created.
    var promise = new Promise(function(resolve, reject) {
      DocTypes.create(docType).then(function(docType) {
        res.json({
          error: null,
          type: docType
        });

        resolve();
      }).catch(function(error) {
        res.badRequest(error);
        reject(error + ' Unable to create document type');
      });
    });

    return promise;
  },
  /**
   * update() - edit a document type.
   */
  update: function(req, res) {
    // TODO: Error checking
    var promise = new Promise(function(resolve, reject) {
      // TODO: getByUser instead of findOne
      DocTypes.findOne({id: req.param('id')}).then(function(docType) {
        // Todo: error checking.
        var newDoc = req.param('type');

        for(param in newDoc) {
          docType[param] = newDoc[param];
        }

        docType.save().then(function() {
          res.json({
            error: null,
            type: docType
          });

          resolve();
        }).catch(function(error) {
          res.badRequest(error);
          reject(error);
        });
      }).catch(function(error) {
        res.badRequest(error);
        reject(error);
      });
    });

    return promise;
  },
  /**
   * destroy() - remove a document type.
   */
  destroy: function(req, res) {
    // Todo: error checking.
    DocTypes.destroy({id: req.param('id')}).exec(function(error) {
        return res.json({
          error: error
        });
    });
  }
};
