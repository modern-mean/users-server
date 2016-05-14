'use strict';

import passport from 'passport';
import * as localStrategy from '../../../../src/server/authentication/strategies/local';

let sandbox;

describe('/modules/users/server/authentication/strategies/local.js', () => {

  beforeEach(() => {
    return sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    return sandbox.restore();
  });

  describe('export', () => {

    it('should export default', () => {
      return localStrategy.default.should.be.an('object');
    });

    it('should export init', () => {
      return localStrategy.strategy.should.be.a('function');
    });

    describe('strategy()', () => {
      let localSpy, passportSpy;

      describe('success', () => {

        beforeEach(() => {
          passportSpy = sandbox.spy(passport, 'use');
        });

        afterEach(() => {
          passportSpy.restore();
        });

        it('should resolve a promise', () => {
          return localStrategy.strategy().should.be.fulfilled;
        });

        it('should call passport.use', () => {
          return localStrategy.strategy()
            .then(() => {
              return passportSpy.should.be.called;
            });
        });

      });

    });

  });

  describe('agent()', () => {

    describe('success', () => {

      it('should authenticate the user', done => {
        request(meanexpress)
          .post('/api/auth/signin')
          .send({ email: testUser.providers[0].email, password: testUserPassword })
          .expect(200)
          .end((err, res) => {
            expect(res.body.token).to.exist;
            return done();
          });

      });

    });

    describe('error', () => {

      describe('user not found', () => {

        it('should respond 500', done => {
          request(meanexpress)
            .post('/api/auth/signin')
            .send({ email: 'asdfadsf434983249@asdfjie.com', password: 'asdfasdf' })
            .expect(500)
            .end((err, res) => {
              expect(res.error.text).to.equal('Invalid email or password\n');
              return done();
            });
        });

      });

      describe('authentication failure', () => {

        it('should responsd 500', done => {
          request(meanexpress)
            .post('/api/auth/signin')
            .send({ email: testUser.providers[0].email, password: 'failme' })
            .expect(500)
            .end((err, res) => {
              expect(res.error.text).to.equal('Invalid email or password\n');
              return done();
            });
        });

      });

      describe('mongoose error should fail', () => {

        let mongooseModel, mockMongoose;

        beforeEach(() => {
          mongooseModel = mongoose.model('User');
          mockMongoose = sandbox.stub(mongooseModel, 'findOne').rejects('Yippee');
        });

        afterEach(() => {
          mockMongoose.restore();
        });

        it('should respond 500', done => {
          request(meanexpress)
            .post('/api/auth/signin')
            .send({ email: testUser.providers[0].email, password: testUserPassword })
            .expect(500)
            .end((err, res) => {
              expect(res.error.text).to.contain('Yippee');
              return done();
            });
        });

      });

    });

  });

});
