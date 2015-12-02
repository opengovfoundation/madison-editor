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
      // * We need to return promises to resolve after the
      //   main controller method is run.
      // * We want to spy on the methods.


      global.Document = {
        dummy: true,
        findByUser: sinon.stub().returns(
          new Promise(function(resolve, reject) {
            findPromise.resolve = resolve;
            findPromise.reject = reject;
          })
        ),
        countByUser: sinon.stub().returns(
          new Promise(function(resolve, reject) {
            countPromise.resolve = resolve;
            countPromise.reject = reject;
          })
        )
      }


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

    });


    it('should use good defaults for pagination', function (done) {
      DocumentController.index(request, response).finally(function(){;
        assert(request.param.calledWith('page', 1),
          'defaults to page = 1');
        assert(request.param.calledWith('limit', null),
          'defaults to limit = null');

        done();
      });

      // Resolve with no values, we don't care about pass or fail here.
      findPromise.resolve();
      countPromise.resolve();
    });

    it('should call find & count', function (done) {
      // Set our expected values.
      var countTestResult = Math.floor((Math.random() * 10));
      var findTestResult = Math.floor((Math.random() * 10));

      // Make sure our values are passed through.
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

      // Resolve with the values we set previously.
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

      // Reject the find, which is an error.
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

      // Reject the count, which is an error.
      findPromise.resolve();
      countPromise.reject();
    });
  });

});
