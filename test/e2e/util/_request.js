const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

//Run the app
const app = require('../../../lib/app');
module.exports = chai.request(app);