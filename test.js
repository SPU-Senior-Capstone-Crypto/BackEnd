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
    it ("Should send and retrieve prop id", (done) => {
        chai.request(app)
        .get('/api/property/1')
        .end((err, res) => {
            let payload = JSON.parse(res.text);
            if (payload[0].property_id == '1'){
                done();
                return;
            } else {
                done(new Error(`wrong response: ${res.text}`));
            }
        });
    });
    it ("should verify the creation of an account", (done) => {
        let data = {
            first : 'testFirst',
            last : 'testLast',
            email : 'testEmail@spu.edu',
            pswd : 'testPassword'
        }
        chai.request(app)
        .put('/api/account/create')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(data)
        .end((err, res) => {
            console.log(res.text);
            if (res.statusCode === 200){
                done();
                return;
            } else {
                done(new Error(`wrong response ${res.text}`));
            }
        });
    });
    it ("should reject the creation of an account due to duplicate email", (done) => {
        let data = {
            first : 'testFirst',
            last : 'testLast',
            email : 'testEmail@spu.edu',
            pswd : 'testPassword'
        }
        chai.request(app)
        .put('/api/account/create')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(data)
        .end((err, res) => {
            console.log(res.text);
            if (res.statusCode === 409){
                done();
                return;
            } else {
                done(new Error(`wrong response ${res.text}`));
            }
        });
    });
});
