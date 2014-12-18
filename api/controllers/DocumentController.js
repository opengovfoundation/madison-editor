var etherpad_client = require('etherpad-lite-client');
var Promise = require('sails/node_modules/waterline/node_modules/bluebird');
var Uuid = require('uuid');

module.exports = {
  /**
   * list() - list all docs
   */
  index: function(req, res) {

    var page=req.param('page',1);
    var limit=req.param('limit',null);

    // Use a promise to get both queries in parallel.
    Promise.all([
      Document.find().paginate({
        page: page,
        limit: limit
      }),
      Document.count()
    ]).spread(function(documents, count) {
      // Get all of our results.
      return res.json({
        error: false,
        page: page,
        limit: limit,
        count: count,
        documents: documents
      });
    }).catch(function(error) {
      // Handle any errors - this occurs on
      // the *first* error.
      return res.json({
        error: error
      });
    });

  },
  get: function(req, res) {
    Document.findOne({slug: req.param('slug')}).exec(function(error, document) {
      return res.json({
        error: false,
        document: document
      });
    });
  },
  post: function(req, res) {
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
      return res.json({
        error: error,
        document: document
      });
    });
  }

};
