const db = require('./util/_db');
const request = require('./util/_request');
const assert = require('chai').assert;

describe('Auth User Management', () => {

  before(db.drop);

  const user = {
    email: 'PomLover57@gmail.com',
    password: 'hunter2'
  };

  const badRequest = (url, data, code, error) =>
    request.post(url)
      .send(data)
      .then(
      () => { throw new Error('Status should not be OK'); },
      res => {
        assert.equal(res.status, code);
        assert.equal(res.response.body.error, error);
      });

  let token = '';

  describe('Sign Up', () => {

    it('signup happy path', () => {
      return request.post('/api/auth/signup')
        .send(user)
        .then(res => {
          token = res.body.token;
          assert.ok(token = res.body.token);
        });
    });

    it('requires email', () => {
      return badRequest('/api/auth/signup', { password: 'hunter2' }, 400, 'Email and password must be entered.');
    });

    it('requires password', () => {
      return badRequest('/api/auth/signup', { email: 'PomLover57' }, 400, 'Email and password must be entered.');
    });

  });

  describe('Sign In', () => {

    it('signin happy path', () => {
      return request.post('/api/auth/signin')
        .send(user)
        .then(res => assert.ok(res.body.token));
    });

    it('email already exists', () => {
      return badRequest('/api/auth/signup', user, 400, 'This email is already in use');
    });

    it('wrong email', () => {
      return badRequest('/api/auth/signin', { email: 'Google Docs Hacker', password: user.password }, 401, 'Invalid Login');
    });

    it('wrong password', () => {
      return badRequest('/api/auth/signin', { email: user.email, password: 'I want your data' }, 401, 'Invalid Login');
    });

    it('token is valid', () => {
      return request.get('/api/auth/verify')
        .set('Authorization', token)
        .then(res => {
          assert.ok(res.body);
        });
    });

  });

  describe('Unauthorized', () => {

    it('401 with no token', () => {
      return request.get('/api/poms')
        .then(
        () => { throw new Error('status should not be 200'); },
        res => {
          assert.equal(res.status, 401);
          assert.equal(res.response.body.error, 'No Authorization Found');
        });
    });

    it('401 with bad token', () => {
      return request.get('/api/poms')
        .set('Authorization', 'faketoken')
        .then(
        () => { throw new Error('status should not be 200'); },
        res => {
          assert.equal(res.status, 401);
          assert.equal(res.response.body.error, 'Authorization Failed');
        });
    });

  });
});