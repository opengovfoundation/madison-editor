// TODO : user validation.

module.exports = {
  /**
   * index() - list all documents.
   */
  index: function(req, res) {

    var page=req.param('page',1);
    var limit=req.param('limit',null);

    // Use a promise to get both queries in parallel.
    // We return the promise so we can test this.
    return Promise.all([
      Document.find().paginate({
        page: page,
        limit: limit
      }),
      Document.count()
    ]).spread(function(documents, count) {
      // Get all of our results.
      return res.json({
        page: page,
        limit: limit,
        count: count,
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
    Document.findOne({slug: req.param('slug')}).exec(function(error, document) {
      return res.json({
        error: false,
        document: document
      });
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
      // Create the etherpad for this document.
      EtherpadService.createPad({padID: document.slug});

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
    Document.findOne({slug: req.param('slug')}).exec(function(error, document) {
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
    Document.destroy({slug: req.param('slug')}).exec(function(error) {
        // Delete the etherpad for this document.
        EtherpadService.deletePad({padID: req.param('slug')});

        return res.json({
          error: error
        });
    });
  }

};
