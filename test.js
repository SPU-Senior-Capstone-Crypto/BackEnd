const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./app');
const pool = require('./modules/db');

chai.use(chaiHttp);
chai.should();

describe("DataBase Connection Test", () => {
    it("Should establish connection with database", (done) => {
        pool.getConnection((err, connection)=>{
            if (err){
                done(error);
            }
        });
        done();
    });
});

describe("Parity Account Service Tests", () => {
    it("Should retrieve simple response to confirm connection to api route (/api/account/)", (done) => {
        chai.request(app)
        .get('/api/account/')
        .end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });
});
