const tokenService = require('./token-service');

module.exports = function getEnsureAuth() {

  return function ensureAuth(req, res, next) {
    const token = req.get('Authorization');
    if (!token) return next({ code: 401, error: 'No Authorization Found' });

    tokenService.verify(token)
    .then(payload => {
      req.user = payload;
      next();
    }, () => {
      next({ code: 401, error: 'Authorization Failed' });
    })
    .catch(err => {
      //eslint-disable-next-line
      console.log('unexpected next() failure', err);
    });
  };
};