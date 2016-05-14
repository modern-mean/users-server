'use strict';

import passport from 'passport';
import * as jwtStrategy from '../../../../src/server/authentication/strategies/jwt';
import jwtToken from '../../../../src/server/authentication/jwtToken';

let sandbox;

describe('/modules/users/server/authentication/strategies/jwt.js', () => {

  beforeEach(() => {
    return sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    return sandbox.restore();
  });

  describe('export', () => {

    it('should export default', () => {
      return jwtStrategy.default.should.be.an('object');
    });

    it('should export init', () => {
      return jwtStrategy.strategy.should.be.a('function');
    });

    describe('strategy()', () => {
      let jwtSpy, passportSpy;

      describe('success', () => {

        beforeEach(() => {
          passportSpy = sandbox.spy(passport, 'use');
        });

        it('should resolve a promise', () => {
          return jwtStrategy.strategy().should.be.fulfilled;
        });

        it('should call passport.use', () => {
          return jwtStrategy.strategy()
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
        jwtToken.signToken(testUser)
          .then(token => {
            request(meanexpress)
              .get('/api/me')
              .set('Authorization', 'JWT ' + token)
              .expect(200, done);
          });

      });

    });

    describe('user not found', () => {

      it('should responsd 500', done => {
        jwtToken.signToken({ _id: '5669a12817d7528f3866efbe' })
          .then(token => {
            request(meanexpress)
              .get('/api/me')
              .set('Authorization', 'JWT ' + token)
              .expect(500)
              .end((err, res) => {
                expect(res.error.text).to.equal('User not found\n');
                return done();
              });
          });

      });

    });

    describe('invalid token', () => {

      it('should responsd 401', done => {
        request(meanexpress)
          .get('/api/me')
          .set('Authorization', 'JWT asdfasdfasdf')
          .expect(401, done);
      });

    });

    describe('mongoose error should reject the token', () => {

      let mongooseModel, mockMongoose;

      beforeEach(() => {
        mongooseModel = mongoose.model('User');
        mockMongoose = sandbox.stub(mongooseModel, 'findById').rejects('Yippee');
      });

      it('should respond 401', done => {
        jwtToken.signToken({ _id: '5669a12817d7528f3866efbe' })
          .then(token => {
            request(meanexpress)
              .get('/api/me')
              .set('Authorization', 'JWT ' + token)
              .expect(500)
              .end((err, res) => {
                expect(res.error.text).to.contain('Yippee');
                done();
              });
          });
      });

    });

  });

});
