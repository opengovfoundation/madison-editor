require('../../bootstrap.test.js');

var sinon = require('sinon');
var assert = require('assert');
var rewire = require('rewire');

global.Promise = require(path('services/Promise.js'));

describe('DocumentController', function() {

  var request, response, DocumentController;

  beforeEach(function() {

    // Some explanation of the weirdness below:
    // * We must mock the Document object to make sure
    //   it's being called properly.
    // * Wolfpack doesn't work.
    // * We need to return promises to resolve after the
    //   main controller method is run.
    // * We want to spy on the methods.

    Document = function() {
      var self = this;

      this.promises = {};
      this.dummy = true; // Easy test that this is a fake object.

      var newPromise = function(name) {
        return new Promise(function(resolve, reject) {
          self.promises[name] = {};
          self.promises[name].resolve = resolve;
          self.promises[name].reject = reject;
        })
      };

      this.findByUser = sinon.stub().returns( newPromise('find') );
      this.countByUser = sinon.stub().returns( newPromise('count') );
      this.getByUser = sinon.stub().returns( newPromise('get') );
      this.create = sinon.stub().returns( newPromise('create') );
    };
    global.Document = new Document();

    DocUser = function() {
      var self = this;

      this.promises = {};
      this.dummy = true;

      var newPromise = function(name) {
        return new Promise(function(resolve, reject) {
          self.promises[name] = {};
          self.promises[name].resolve = resolve;
          self.promises[name].reject = reject;
        })
      };

      this.create = sinon.stub().returns( newPromise('create') );
    };
    global.DocUser = new DocUser();

    global.EtherpadService = {
      createPad: sinon.stub()
    };

    global.Uuid = {
      v4: sinon.stub(),
      dummy: true
    };

    // Mock our request and response objects.
    request = {
      param: sinon.stub(),
      session: {
        user: {
          id: 1
        }
      }
    };
    request.param.withArgs('id').returns(1);
    request.param.withArgs('document').returns(null);

    response = {
      json: sinon.stub(),
      badRequest: sinon.stub()
    };

    // Setup our controller for testing.
    DocumentController = require(path('/controllers/DocumentController'));

  });

  describe('index()', function() {

    it('should use good defaults for pagination', function (done) {

      DocumentController.index(request, response).finally(function(){;
        assert(request.param.calledWith('page', 1),
          'defaults to page = 1');
        assert(request.param.calledWith('limit', null),
          'defaults to limit = null');

        done();
      });

      // Resolve with no values, we don't care about pass or fail here.
      global.Document.promises.find.resolve();
      global.Document.promises.count.resolve();
    });

    it('should send OK for a good request', function (done) {
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
      global.Document.promises.find.resolve(findTestResult);
      global.Document.promises.count.resolve({count: countTestResult});
    });

    it('should send a badRequest on find error', function (done) {
      DocumentController.index(request, response).finally(function() {
        assert(Document.findByUser.called, 'calls Document.findByUser()');
        assert(Document.countByUser.called, 'calls Document.countByUser()');
        assert(response.badRequest.called, 'calls response.badRequest');
        done();
      });

      // Reject the find, which is an error.
      global.Document.promises.find.reject();
      global.Document.promises.count.resolve();
    });

    it('should send a badRequest on count error', function (done) {
      DocumentController.index(request, response).finally(function() {
        assert(Document.findByUser.called, 'calls Document.findByUser()');
        assert(Document.countByUser.called, 'calls Document.countByUser()');
        assert(response.badRequest.called, 'calls response.badRequest');
        done();
      });

      // Reject the count, which is an error.
      global.Document.promises.find.resolve();
      global.Document.promises.count.reject();
    });

    it('should send a badRequest on non-numeric user ids', function (done) {
      request.session.user.id = 'a';
      // Should never even get to a promise.
      DocumentController.find(request, response);
      assert(!Document.findByUser.called, 'calls Document.findByUser()');
      assert(response.badRequest.called, 'calls response.badRequest');
      done();

    });

    it('should send a badRequest if there\'s no session user', function (done) {
      delete request.session;
      // Should never even get to a promise.
      DocumentController.find(request, response)
      assert(!Document.findByUser.called, 'calls Document.findByUser()');
      assert(response.badRequest.called, 'calls response.badRequest');
      done();
    });
  });

  describe('find()', function() {

    it('should send OK for a good request', function (done) {
      var testDoc = 'document';

      DocumentController.find(request, response).finally(function() {
        assert(Document.getByUser.called, 'calls Document.findByUser()');
        assert(response.json.called, 'calls response.json');
        assert(response.json.args[0][0].document === testDoc,
          'sends a response document.');
        done();
      });

      global.Document.promises.get.resolve([testDoc]);
    });

    it('should send a badRequest on find error', function (done) {
      DocumentController.find(request, response).finally(function() {
        assert(Document.getByUser.called, 'calls Document.findByUser()');
        assert(response.badRequest.called, 'calls response.badRequest');
        done();
      });

      global.Document.promises.get.reject();
    });

    it('should send a badRequest on non-numeric document ids', function (done) {
      request.param = sinon.stub().withArgs('id').returns('a'),
      // Should never even get to a promise.
      DocumentController.find(request, response);
      assert(!Document.getByUser.called, 'calls Document.findByUser()');
      assert(response.badRequest.called, 'calls response.badRequest');
      done();
    });

    it('should send a badRequest on non-numeric user ids', function (done) {
      request.session.user.id = 'a';
      // Should never even get to a promise.
      DocumentController.find(request, response);
      assert(!Document.getByUser.called, 'calls Document.findByUser()');
      assert(response.badRequest.called, 'calls response.badRequest');
      done();

    });

    it('should send a badRequest if there\'s no session user', function (done) {
      delete request.session;
      // Should never even get to a promise.
      DocumentController.find(request, response)
      assert(!Document.getByUser.called, 'calls Document.findByUser()');
      assert(response.badRequest.called, 'calls response.badRequest');
      done();
    });
  });

  describe('create()', function() {

    it('should send OK for a good request', function (done) {
      var testDoc = 'document';

      DocumentController.create(request, response).finally(function() {
        done();
      });

      global.Document.promises.create.resolve(true);
      global.DocUser.promises.create.resolve(true);
    });
  });
});
