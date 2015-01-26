var sinon = require('sinon');
var assert = require('assert');
var rewire = require("rewire");
global.Promise = require(path('services/Promise.js'));

describe('DocumentController', function() {

  describe('index()', function() {

    var request, response, DocumentController,
      findPromise, countPromise;

    beforeEach(function() {
      // Placeholders for promises.
      findPromise = {};
      countPromise = {};

      // Some explanation of the weirdness below:
      // * We must mock the Document object to make sure
      //   it's being called properly.
      // * Wolfpack doesn't work.
      // * We need to return promises.
      // * We assume paginate() is chained onto find().

      global.Document = {
        find: function() {
          return this;
        },
        paginate: function() {
          // store these promises for later.
          return new Promise(function(resolve, reject)
          {
            findPromise.resolve = resolve;
            findPromise.reject = reject;
          });
        },
        count: function() {
          // store these promises for later.
          return new Promise(function(resolve, reject)
          {
            countPromise.resolve = resolve;
            countPromise.reject = reject;
          });
        }
      }

      // Setup our spies.
      sinon.spy(global.Document, 'find');
      sinon.spy(global.Document, 'count');

      // Mock our request and response objects.
      request = {
        param: sinon.spy()
      };
      response = {
        badRequest: function() {
        },
        json: function() {
        }
      };
      sinon.spy(response, 'badRequest');
      sinon.spy(response, 'json');

      DocumentController = require(path('/controllers/DocumentController'));
    });


    it('should use good defaults for pagination', function (done) {

      DocumentController.index(request, response);

      findPromise.resolve();
      countPromise.resolve();

      assert(request.param.calledWith('page', 1),
        'defaults to page = 1');
      assert(request.param.calledWith('limit', null),
        'defaults to limit = null');

      done();
    });

    it('should call find & count', function (done) {

      DocumentController.index(request, response);

      findPromise.resolve();
      countPromise.resolve();

      assert(global.Document.find.called, 'calls Document.find()');
      assert(Document.count.called, 'calls Document.count()');

      done();
    });
  });

});
