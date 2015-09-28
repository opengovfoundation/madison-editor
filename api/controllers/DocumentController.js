// TODO : user validation.

module.exports = {
  /**
   * index() - list all documents.
   */
  index: function(req, res) {

    if(!req.session || !req.session.user || !req.session.user.id) {
      return res.badRequest('Unauthorized.');
    }

    var page=req.param('page',1);
    var limit=req.param('limit',null);

    // Use a promise to get both queries in parallel.
    // We return the promise so we can test this.
    return Promise.all([
      Document.findByUser(req.session.user.id, page, limit),
      Document.countByUser(req.session.user.id)
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

    var isNumeric = /^\d+$/;
    if(!isNumeric.test(req.session.user.id) || !isNumeric.test(req.param('id'))) {
      return res.badRequest('Id is not valid.');
    }

    Document.getByUser(req.param('id'), req.session.user.id).then(function(document) {
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

    Document.create(doc, function(error, document) {
      DocUser.create({
        user_id: req.session.user.id,
        doc_id: document.id
      });

      // Create the etherpad for this document.
      EtherpadService.createPad({padID: document.id});

      return res.json({
        error: error,
        document: document
      });
    });
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
        document.save();
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
