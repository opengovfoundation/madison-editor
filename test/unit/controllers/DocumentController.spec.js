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
      // The response calls done() when it's done.
      response = {
        badRequest: function() {
          response.done();
        },
        json: function() {
          response.done();
        }
      };
      sinon.spy(response, 'badRequest');
      sinon.spy(response, 'json');

      // Setup our controller for testing.
      DocumentController = require(path('/controllers/DocumentController'));
    });


    it('should use good defaults for pagination', function (done) {
      // Set this instance's done method.
      response.done = done;

      DocumentController.index(request, response);

      findPromise.resolve();
      countPromise.resolve();

      assert(request.param.calledWith('page', 1),
        'defaults to page = 1');
      assert(request.param.calledWith('limit', null),
        'defaults to limit = null');
    });

    it('should call find & count', function (done) {
      // Set this instance's done method.
      response.done = done;

      DocumentController.index(request, response).finally(function() {
        assert(Document.find.called, 'calls Document.find()');
        assert(Document.count.called, 'calls Document.count()');
        assert(response.json.called, 'calls response.json');

      });

      findPromise.resolve();
      countPromise.resolve();
    });

    it('should send a badRequest on find error', function (done) {
      // Set this instance's done method.
      response.done = done;

      DocumentController.index(request, response).finally(function() {
        assert(Document.find.called, 'calls Document.find()');
        assert(Document.count.called, 'calls Document.count()');
        assert(response.badRequest.called, 'calls response.badRequest');
      });

      findPromise.reject();
      countPromise.resolve();
    });

    it('should send a badRequest on count error', function (done) {
      // Set this instance's done method.
      response.done = done;

      DocumentController.index(request, response).finally(function() {
        assert(Document.find.called, 'calls Document.find()');
        assert(Document.count.called, 'calls Document.count()');
        assert(response.badRequest.called, 'calls response.badRequest');
      });

      findPromise.resolve();
      countPromise.reject();
    });
  });

});
