'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Help = mongoose.model('Help'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, help;

/**
 * Help routes tests
 */
describe('Help CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Help
    user.save(function () {
      help = {
        name: 'Help name'
      };

      done();
    });
  });

  it('should be able to save a Help if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Help
        agent.post('/api/helps')
          .send(help)
          .expect(200)
          .end(function (helpSaveErr, helpSaveRes) {
            // Handle Help save error
            if (helpSaveErr) {
              return done(helpSaveErr);
            }

            // Get a list of Helps
            agent.get('/api/helps')
              .end(function (helpsGetErr, helpsGetRes) {
                // Handle Help save error
                if (helpsGetErr) {
                  return done(helpsGetErr);
                }

                // Get Helps list
                var helps = helpsGetRes.body;

                // Set assertions
                (helps[0].user._id).should.equal(userId);
                (helps[0].name).should.match('Help name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Help if not logged in', function (done) {
    agent.post('/api/helps')
      .send(help)
      .expect(403)
      .end(function (helpSaveErr, helpSaveRes) {
        // Call the assertion callback
        done(helpSaveErr);
      });
  });

  it('should not be able to save an Help if no name is provided', function (done) {
    // Invalidate name field
    help.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Help
        agent.post('/api/helps')
          .send(help)
          .expect(400)
          .end(function (helpSaveErr, helpSaveRes) {
            // Set message assertion
            (helpSaveRes.body.message).should.match('Please fill Help name');

            // Handle Help save error
            done(helpSaveErr);
          });
      });
  });

  it('should be able to update an Help if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Help
        agent.post('/api/helps')
          .send(help)
          .expect(200)
          .end(function (helpSaveErr, helpSaveRes) {
            // Handle Help save error
            if (helpSaveErr) {
              return done(helpSaveErr);
            }

            // Update Help name
            help.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Help
            agent.put('/api/helps/' + helpSaveRes.body._id)
              .send(help)
              .expect(200)
              .end(function (helpUpdateErr, helpUpdateRes) {
                // Handle Help update error
                if (helpUpdateErr) {
                  return done(helpUpdateErr);
                }

                // Set assertions
                (helpUpdateRes.body._id).should.equal(helpSaveRes.body._id);
                (helpUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Helps if not signed in', function (done) {
    // Create new Help model instance
    var helpObj = new Help(help);

    // Save the help
    helpObj.save(function () {
      // Request Helps
      request(app).get('/api/helps')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Help if not signed in', function (done) {
    // Create new Help model instance
    var helpObj = new Help(help);

    // Save the Help
    helpObj.save(function () {
      request(app).get('/api/helps/' + helpObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', help.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Help with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/helps/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Help is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Help which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Help
    request(app).get('/api/helps/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Help with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Help if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Help
        agent.post('/api/helps')
          .send(help)
          .expect(200)
          .end(function (helpSaveErr, helpSaveRes) {
            // Handle Help save error
            if (helpSaveErr) {
              return done(helpSaveErr);
            }

            // Delete an existing Help
            agent.delete('/api/helps/' + helpSaveRes.body._id)
              .send(help)
              .expect(200)
              .end(function (helpDeleteErr, helpDeleteRes) {
                // Handle help error error
                if (helpDeleteErr) {
                  return done(helpDeleteErr);
                }

                // Set assertions
                (helpDeleteRes.body._id).should.equal(helpSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Help if not signed in', function (done) {
    // Set Help user
    help.user = user;

    // Create new Help model instance
    var helpObj = new Help(help);

    // Save the Help
    helpObj.save(function () {
      // Try deleting Help
      request(app).delete('/api/helps/' + helpObj._id)
        .expect(403)
        .end(function (helpDeleteErr, helpDeleteRes) {
          // Set message assertion
          (helpDeleteRes.body.message).should.match('User is not authorized');

          // Handle Help error error
          done(helpDeleteErr);
        });

    });
  });

  it('should be able to get a single Help that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Help
          agent.post('/api/helps')
            .send(help)
            .expect(200)
            .end(function (helpSaveErr, helpSaveRes) {
              // Handle Help save error
              if (helpSaveErr) {
                return done(helpSaveErr);
              }

              // Set assertions on new Help
              (helpSaveRes.body.name).should.equal(help.name);
              should.exist(helpSaveRes.body.user);
              should.equal(helpSaveRes.body.user._id, orphanId);

              // force the Help to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Help
                    agent.get('/api/helps/' + helpSaveRes.body._id)
                      .expect(200)
                      .end(function (helpInfoErr, helpInfoRes) {
                        // Handle Help error
                        if (helpInfoErr) {
                          return done(helpInfoErr);
                        }

                        // Set assertions
                        (helpInfoRes.body._id).should.equal(helpSaveRes.body._id);
                        (helpInfoRes.body.name).should.equal(help.name);
                        should.equal(helpInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Help.remove().exec(done);
    });
  });
});
