const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('Auth User Management', () => {

  before(db.drop);

  const user = {
    username: 'PomLover57',
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

    it.only('signup happy path', () => {
      return request.post('/auth/signup')
        .send(user)
        .then(res => assert.ok(token = res.body.token));
    });

    it('requires username', () => {
      return badRequest('/auth/signup', { password: 'hunter2' }, 400, 'Username and password required');
    });

    it('requires password', () => {
      return badRequest('/auth/signup', { username: 'PomLover57' }, 400, 'Username and password required');
    });

  });

  describe('Sign In', () => {

    it('signin happy path', () => {
      return request.post('/auth/signin')
        .send(user)
        .then(res => assert.ok(res.body.token));
    });

    it('token is valid', () => {
      return request.get('/auth/verify')
        .set('Authorization', token)
        .then(res => assert.ok(res.body));
    });

  });
});