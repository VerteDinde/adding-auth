const db = require('./util/_db');
const request = require('./util/_request');
const assert = require('chai').assert;

describe('Poms API', () => {

  before(db.drop);

  let token = '';

  //create a token!
  before(() => {
    return request.post('/api/auth/signup')
      .send({ email: 'keeley@thedrawplay.com', password: 'banana' })
      .then(res => {
        token = res.body.token;
      });
  });

  it('GET/:id pom with token', () => {
    let pom = {
      name: 'Brownie',
      color: 'black',
      weight: 20,
      bestPom: true
    };

    return request.post('/api/poms')
      .send(pom)
      .set('Authorization', token)
      .then(res => {
        pom = res.body;
        return request.get(`/api/poms/${pom._id}`)
          .set('Authorization', token);
      })
      .then(res => {
        const fetched = res.body;
        assert.deepEqual(fetched, pom);
      })
      .catch(err => { throw err; });
  });

  it('POST/ pom with token', () => {
    let pom2 = {
      name: 'BoBo',
      color: 'white',
      weight: 15,
      bestPom: true
    };

    return request.post('/api/poms')
      .send(pom2)
      .set('Authorization', token)
      .then(res => {
        assert.ok(res.body._id, 'saved has id');
        pom2 = res.body;
      })
      .catch(err => { throw err; });
  });

  it('GET/ list of all poms', () => {
    return request.get('/api/poms')
    .set('Authorization', token)
    .then(res => res.body)
    .then(poms => {
      assert.equal(poms.length, 2);
      assert.include(poms[0].name, 'Brownie');
    });
  });

});