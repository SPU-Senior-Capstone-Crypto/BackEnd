const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./app');

chai.use(chaiHttp);
chai.should();

describe("Parity Account Service Tests", () => {
    it("Should retrieve simple response to confirm connection", (done) => {
        chai.request(app)
        .get('/api/account/')
        .end((err, res) => {
            res.should.have.status(200);
            done();
        })
    })
});