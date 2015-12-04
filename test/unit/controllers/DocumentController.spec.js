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

    StubObject = function(promiseMethods) {
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

      for(i = 0; i < promiseMethods.length; i++) {
        this[promiseMethods[i]] = sinon.stub().returns(
          newPromise(promiseMethods[i]) );
      }
    };

    global.Document = new StubObject([
      'findByUser',
      'findOne',
      'countByUser',
      'getByUser',
      'create'
    ]);

    global.DocUser = new StubObject(['create']);

    global.EtherpadService = {
      createPad: sinon.stub()
    };

    global.Uuid = {
      v4: sinon.stub().returns('testslug'),
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

  // Most of our tests below follow the pattern of:
  // 0) Setup any extras
  // 1) Call the function being tested
  // 2) Inside the returned promise of that function, do our tests
  // 3) resolve() the promises we know that function relies on,
  //    causing the promise in the function to complete and 2) then runs.
  // We've marked up the first test below to match this pattern.

  describe('index()', function() {

    it('should use good defaults for pagination', function (done) {

      // 1) Call the function being tested (index)
      DocumentController.index(request, response).finally(function(){
        // 2) Test our assertions
        assert(request.param.calledWith('page', 1),
          'defaults to page = 1');
        assert(request.param.calledWith('limit', null),
          'defaults to limit = null');

        // Complete the overall test with done()
        done();
      });

      // 3) resolve our promises, causing 2) to run.
      // Resolve with no values, we don't care about pass or fail here.
      global.Document.promises.findByUser.resolve();
      global.Document.promises.countByUser.resolve();
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
      global.Document.promises.findByUser.resolve(findTestResult);
      global.Document.promises.countByUser.resolve({count: countTestResult});
    });

    it('should send a badRequest on find error', function (done) {
      DocumentController.index(request, response).finally(function() {
        assert(Document.findByUser.called, 'calls Document.findByUser()');
        assert(Document.countByUser.called, 'calls Document.countByUser()');
        assert(response.badRequest.called, 'calls response.badRequest');
        done();
      });

      // Reject the find, which is an error.
      global.Document.promises.findByUser.reject();
      global.Document.promises.countByUser.resolve();
    });

    it('should send a badRequest on count error', function (done) {
      DocumentController.index(request, response).finally(function() {
        assert(Document.findByUser.called, 'calls Document.findByUser()');
        assert(Document.countByUser.called, 'calls Document.countByUser()');
        assert(response.badRequest.called, 'calls response.badRequest');
        done();
      });

      // Reject the count, which is an error.
      global.Document.promises.findByUser.resolve();
      global.Document.promises.countByUser.reject();
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

      global.Document.promises.getByUser.resolve([testDoc]);
    });

    it('should send a badRequest on find error', function (done) {
      DocumentController.find(request, response).finally(function() {
        assert(Document.getByUser.called, 'calls Document.findByUser()');
        assert(response.badRequest.called, 'calls response.badRequest');
        done();
      });

      global.Document.promises.getByUser.reject();
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

    it('should send OK for an empty create.', function (done) {
      var testDoc = 'document';

      DocumentController.create(request, response).finally(function() {
        assert(Document.create.called, 'calls Document.create()');
        assert(Document.create.calledWith({
          title: 'Untitled Document',
          slug: 'testslug'
        }), 'uses good defaults for creating a Document.');
        assert(Uuid.v4.called, 'uses a UUID if no slug is given.');
        assert(DocUser.create.called, 'calls DocUser.create()');
        assert(EtherpadService.createPad.called, 'creates an Etherpad pad');
        assert(response.json.called, 'calls response.json');
        assert(response.json.args[0][0].document === testDoc,
          'sends a response document.');
        done();
      });

      global.Document.promises.create.resolve(testDoc);
      global.DocUser.promises.create.resolve(true);
    });

    it('should still be ok on a good document.', function (done) {
      var testDoc = {
        title: 'Our New Title',
        slug: 'my-test-slug'
      };
      request.param.withArgs('document').returns(testDoc);

      DocumentController.create(request, response).finally(function() {
        assert(Document.create.calledWith(testDoc),
            'if a document is passed, use it');
        assert(response.json.args[0][0].document === testDoc,
          'sends the correct response document.');
        done();
      });

      global.Document.promises.create.resolve(testDoc);
      global.DocUser.promises.create.resolve(true);
    });

    it('should send a badRequest on Document.create error', function (done) {
      DocumentController.create(request, response).catch(function() {
        // Do nothing.  We need this here to catch the rejection though.
      }).finally(function() {
        assert(Document.create.called, 'calls Document.create()');
        assert(!DocUser.create.called, 'doesn\'t call DocUser.create()');
        assert(!EtherpadService.createPad.called, 'doesn\'t create a pad');
        assert(response.badRequest.called, 'calls response.badRequest');
        done();
      });

      // Reject the document create, which is an error.
      global.Document.promises.create.reject(false);
    });

    it('should send a badRequest on DocUser.create error', function (done) {
      var testDoc = 'document';

      DocumentController.create(request, response).catch(function() {
        // Do nothing.  We need this here to catch the rejection though
      }).finally(function() {
        assert(Document.create.called, 'calls Document.create()');
        assert(DocUser.create.called, 'calls DocUser.create()');
        assert(!EtherpadService.createPad.called, 'doesn\'t create a pad');
        assert(response.badRequest.called, 'calls response.badRequest');
        done();
      });

      // Reject the docuser create, which is an error.
      global.Document.promises.create.resolve(testDoc);
      global.DocUser.promises.create.reject(false);
    });
  });

  describe('update()', function() {
    var documentInstance, testDoc;

    beforeEach(function() {
      documentInstance = new StubObject(['save']);

      request.param.withArgs('id').returns(17);

      testDoc = {
        title: 'Our New Title',
        slug: 'my-test-slug'
      };
      request.param.withArgs('document').returns(testDoc);
    });

    it('should send OK for a good request', function (done) {

      DocumentController.update(request, response).finally(function() {
        assert(Document.findOne.called, 'calls Document.create()');
        assert(Document.findOne.calledWith({id: request.param('id')}),
          'finds the right document.');
        assert(documentInstance.save.called, 'saves the document');

        assert(response.json.called, 'calls response.json');

        assert(response.json.args[0][0].document !== null,
          'sends a response document.');
        assert(response.json.args[0][0].document.title === testDoc.title,
          'sends correct document.');
        assert(response.json.args[0][0].document.slug === testDoc.slug,
          'sends correct document.');

        console.log('test');
        done();
      });

      global.Document.promises.findOne.resolve(documentInstance);
      documentInstance.promises.save.resolve();
    });
/////// TODO:

    it('should send a badRequest on Document.findOne error', function (done) {
      DocumentController.update(request, response).catch(function() {
        // Do nothing.  We need this here to catch the rejection though.
      }).finally(function() {
        assert(Document.findOne.called, 'calls Document.findOne()');
        assert(!documentInstance.save.called, 'doesn\'t save');
        assert(response.badRequest.called, 'calls response.badRequest');
        done();
      });

      // Reject the document update, which is an error.
      global.Document.promises.findOne.reject(documentInstance);
    });

    it('should send a badRequest on DocUser.create error', function (done) {
      var testDoc = 'document';

      DocumentController.update(request, response).catch(function() {
        // Do nothing.  We need this here to catch the rejection though
      }).finally(function() {
        assert(Document.findOne.called, 'calls Document.findOne()');
        assert(documentInstance.promises.save, 'tries to save');
        assert(response.badRequest.called, 'calls response.badRequest');
        done();
      });

      // Reject the document save, which is an error.
      global.Document.promises.findOne.resolve(documentInstance);
      documentInstance.promises.save.reject();
    });
  });
});
