module.exports = {
  checkErrors: function (fields, req) {
    for(var name in fields) {
      var field = fields[name];
      var value = req.param(name);
      if(field.type === 'numeric') {
        if(
          !/^\d+$/.test(value) ||
          (field.optional == true && typeof value !== 'undefined')
        ) {
          var message = field.label || field.name;
          message += 'is not valid, must be integer';
          return message;
        }
      }
      // Add more types here.
    }

    return false;
  },

  /**
   * index() - list all documents.
   */
  index: function(req, res) {

    if(!req.session || !req.session.user || !req.session.user.id) {
      return res.badRequest('Unauthorized.');
    }

    var isNumeric = /^\d+$/;
    if(!isNumeric.test(req.session.user.id) && !isNumeric.test(req.param('id'))) {
      return res.badRequest('id is not valid, must be integer.');
    }

    var errors = module.exports.checkErrors({
      'page': {
        'type': 'numeric',
        'optional': true
      },
      'limit': {
        'type': 'numeric',
        'optional': true
      },
      'is_template': {
        'type': 'numeric',
        'optional': true
      }
    }, req);

    // TODO: Send bad request on errors.

    var page = req.param('page', 1);

    var limit = req.param('limit', null);

    var filters = {
      'is_template': req.param('is_template', null)
    };

    // Use a promise to get both queries in parallel.
    // We return the promise so we can test this.
    return Promise.all([
      Document.findByUser(req.session.user.id, page, limit, filters),
      Document.countByUser(req.session.user.id, filters)
    ]).spread(function(documents, count) {
      // Get all of our results.
      return res.json({
        page: page,
        limit: limit,
        count: count.count,
        documents: documents
      });
    }).catch(function(error) {
      // Handle any errors - this occurs on
      // the *first* error.
      return res.badRequest(error);
    });
  },
  /**
   * find() - find a single document by its slug.
   */
  find: function(req, res) {
    if(!req.session || !req.session.user || !req.session.user.id) {
      return res.badRequest('Unauthorized.');
    }

    // TODO: use error check function here instead.
    var isNumeric = /^\d+$/;
    if(!isNumeric.test(req.session.user.id) || !isNumeric.test(req.param('id'))) {
      return res.badRequest('Id is not valid.');
    }

    return Document.getByUser(req.param('id'), req.session.user.id).then(function(document) {
      return res.json({
        error: false,
        document: document[0]
      });
    }).catch(function(error) {
      return res.badRequest(error);
    });
  },
  /**
   * create() - create a new document.
   */
  create: function(req, res) {
    var doc = req.param('document');
    if(!doc)
    {
      doc = {
        'title': 'Untitled Document'
      };
    }
    // We need a slug.
    if(!doc.slug){
      doc.slug = Uuid.v4();
    }

    // Create a new promise to resolve when everything is created.
    var promise = new Promise(function(resolve, reject) {
      Document.create(doc).then(function(document) {
        DocUser.create({
          user_id: req.session.user.id,
          doc_id: document.id
        }).then(function(error, doc_user) {
          // Create the etherpad for this document.
          EtherpadService.createPad({padID: document.id});

          res.json({
            error: null,
            document: document
          });

          resolve();
        }).catch(function(error) {
          res.badRequest(error);
          reject(error + ' Unable to create document owner');
        });
      }).catch(function(error) {
        res.badRequest(error);
        reject(error + ' Unable to create document');
      });
    });

    return promise;
  },
  /**
   * update() - edit a document.
   */
  update: function(req, res) {

    Document.findOne({id: req.param('id')}).exec(function(error, document) {
      if(document){
        // Todo: error checking.
        var newDoc = req.param('document');

        for(param in newDoc) {
          document[param] = newDoc[param];
        }
        document.save(function(error, result) {
          res.json({
            error: error,
            result: result
          });
        });
      }
      else {
        return res.json({
          error: error,
          document: document
        });
      }
    });
  },
  /**
   * destroy() - remove a document.
   */
  destroy: function(req, res) {
    // Todo: error checking.
    Document.destroy({id: req.param('id')}).exec(function(error) {
        // Delete the etherpad for this document.
        EtherpadService.deletePad({padID: req.param('id')});

        return res.json({
          error: error
        });
    });
  }

};
