require('../../bootstrap.test.js');

var sinon = require('sinon');
var assert = require('assert');
var rewire = require('rewire');

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
        dummy: true,
        find: function() {
          return this;
        },
        findByUser: function() {
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
        },
        countByUser: function() {
          // store these promises for later.
          return new Promise(function(resolve, reject)
          {
            countPromise.resolve = resolve;
            countPromise.reject = reject;
          });
        }
      }


      // Setup our model spies.
      sinon.spy(Document, 'find');
      sinon.spy(Document, 'count');
      sinon.spy(Document, 'findByUser');
      sinon.spy(Document, 'countByUser');

      // Mock our request and response objects.
      request = {
        param: sinon.stub(),
        session: {
          user: {
            id: 1
          }
        }
      };

      response = {
        json: sinon.stub(),
        badRequest: sinon.stub()
      };

      // Setup our controller for testing.
      DocumentController = require(path('/controllers/DocumentController'));
      DocumentController.index(request, response);

    });


    it('should use good defaults for pagination', function (done) {
      DocumentController.index(request, response).finally(function(){;
        assert(request.param.calledWith('page', 1),
          'defaults to page = 1');
        assert(request.param.calledWith('limit', null),
          'defaults to limit = null');

        done();
      });

      findPromise.resolve();
      countPromise.resolve();
    });

    it('should call find & count', function (done) {
      var countTestResult = Math.floor((Math.random() * 10));
      var findTestResult = Math.floor((Math.random() * 10));

      DocumentController.index(request, response)
        .finally(function(findResult, countResult) {
        assert(Document.findByUser.called, 'calls Document.findByUser()');
        assert(Document.countByUser.called, 'calls Document.countByUser()');
        assert(response.json.called, 'calls response.json');
        assert(response.json.args[0][0].count === countTestResult,
          'Gets the right count');
        assert(response.json.args[0][0].documents === findTestResult,
          'Gets the right documents');

        done();
      });

      findPromise.resolve(findTestResult);
      countPromise.resolve({count: countTestResult});
    });

    it('should send a badRequest on find error', function (done) {
      DocumentController.index(request, response).finally(function() {
        assert(Document.findByUser.called, 'calls Document.findByUser()');
        assert(Document.countByUser.called, 'calls Document.countByUser()');
        assert(response.badRequest.called, 'calls response.badRequest');
        done();
      });

      findPromise.reject();
      countPromise.resolve();
    });

    it('should send a badRequest on count error', function (done) {
      DocumentController.index(request, response).finally(function() {
        assert(Document.findByUser.called, 'calls Document.findByUser()');
        assert(Document.countByUser.called, 'calls Document.countByUser()');
        assert(response.badRequest.called, 'calls response.badRequest');
        done();
      });

      findPromise.resolve();
      countPromise.reject();
    });
  });

});
