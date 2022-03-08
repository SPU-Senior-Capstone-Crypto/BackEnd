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
        .get('/api/account/secrert')
        .end((err, res) => {
            res.should.have.status(200);
            if (err){
                done(err);
                return;
            }
        });
        done();
    });
    it ("Should send and retrieve prop id", (done) => {
        chai.request(app)
        .get('/api/property/123')
        .end((err, res) => {
            if (res.text == '123'){
                console.log('res text hit');
                done();
                return;
            } else {
                done(new Error('wrong response'));
            }
        });
    });
});
