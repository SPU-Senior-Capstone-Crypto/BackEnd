const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./app');
const pool = require('./modules/db');
const Sesh = require('./modules/session');
const Portfolio = require('./modules/portfolio')

chai.use(chaiHttp);
chai.should();

describe("DataBase Connection Test", () => {
    it("Should establish connection with database", (done) => {
        pool.getConnection((err, connection)=>{
            if (err){
                done(err);
            } else {
                done();
            }
        });
        
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
        .set('content-type', 'application/json')
        .send(JSON.stringify(data))
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
        .set('content-type', 'application/json')
        .send(JSON.stringify(data))
        .end((err, res) => {
            if (res.statusCode === 404){
                done();
                return;
            } else {
                done(new Error(`wrong response ${res.text}`));
            }
        });
    });
    it ('delete test account form db', (done) => {
        let data = {
            email : 'testEmail@spu.edu',
            pswd : 'testPassword'
        }
        chai.request(app)
        .delete('/api/account/')
        .set('content-type', 'application/json')
        .send(JSON.stringify(data))
        .end((err, res) => {
            if (res.statusCode === 200){
                done();
                return;
            } else {
                done(new Error(`Error in delete account${err}`));
            }
        });
    });
});

describe('Test the Session capabilities.', () => {
    let Session = new Sesh(1, 'rgraue@spu.edu');
    it ('Should simulate the lifecycle of a session', (done) => {
        Session.createSession();
        Session.getSession((ssid) => {
            chai.request(app)
            .post('/api/account/chart')
            .set('content-type', 'application/json')
            .send(JSON.stringify({ssid:ssid}))
            .end((err, res) => {
                console.log(res.text);
            });
            if (typeof ssid == "number"){
                done();
            } else {
                done(new Error("Wrong ssid"));
            }
        });
    });
    // fix for parallel session interactions
    Session.getSession((ssid) => {
        Session.deleteSession(ssid);
    })
});

// describe('Test Transactions', () => {
//     let tBody = {
//         shares:-10,
//         value:"0x38D7EA4C68000",
//         hash:"testHash",
//         sender:"testSender",
//         recipient:"testRecipient",
//         property_id:1
//     }

//     it("Should generate transaction", (done) => {
//         let Session = new Sesh(1, 'rgraue@spu.edu');
//         Session.createSession();
//         Session.getSession( (ssid) => {
//             tBody.ssid = ssid;
//             chai.request(app)
//             .post('/api/transaction')
//             .set('Content-type', 'application/json')
//             .send(tBody)
//             .end( (err, res) => {
//                 Session.deleteSession(ssid);
//                 if(res.statusCode == 200){
//                     console.log(res.text)
//                     done();
//                 } else {
//                     done(new Error(`${err}`));
//                 }
//             });
//         });
//     });
// });

// describe("Test Portfolio", () => {
//     it("should get balance", (done) => {
//         pool.query(
//             `SELECT * FROM transaction
//             INNER JOIN property USING (property_id)
//             HAVING user_id = 1;`,
//             (err, res, fields) => {
//                 if (err){
//                     done(new Error(err))
//                 }
//                 let p = new Portfolio(res);
//                 let b = p.createChart((r) => {
//                     console.log(JSON.stringify(r));
//                 });
//                 done();
//             }
//         );
//     });
// });
