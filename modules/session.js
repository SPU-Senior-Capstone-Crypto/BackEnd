const pool = require ('./db')

/**
 * Needs to create a new session in DB
 * Needs to delete sessions
 * Needs to verify sessions
 */

class Session {
    /**
     * Creates a session object and creates on in DB
     * uid and email saved in cookie
     */
    constructor(uid = -1, email = ''){
        this.uid = uid
        this.email = email
    }

    /**
     * Creates a new session on the db
     */
    createSession () {
        let query = `INSERT INTO sessions (user_id) VALUES (${this.uid});`;
        pool.query(query, (error, result, fields) => {
            if (error){
                console.log(error);
            }
        });
    }

    /**
     * Async retrieves the ssid
     * @param {callback} fn callback function do interact with ssid num
     */
    getSession (fn) {
        if (this.ssid === undefined){
            let query = `SELECT ssid FROM sessions WHERE user_id = ${this.uid};`;
            pool.query(query, (error, result, fields) => {
                if (error) {
                    fn(-1);
                } 
                if (result.length == 0){
                    fn(-1);
                }else {
                    fn(result[result.length - 1].ssid);
                }
            });
        }
    }

    /**
     * Gets the sessions user id goven a valid ssid
     * @param {number} ssid of session to find user_id associated with
     * @param {callback} fn callback function. -1 if error or not found, or user_id if found
     */
    getUser (ssid, fn) {
        let query = `SELECT * FROM sessions WHERE ssid = ${ssid}`
        pool.query(query, (error, result, fields) => {
            if (error){
                fn(-1);
            }
            if (result.length == 0){    // no ssid/uid combo
                fn(-1);
            } else {
                fn(result[0].user_id); 
            }

        });
    }

    /**
     * 
     * @param {number} ssid user session id
     * @param {callback} fn callback function to interact with it being a valid session or not
     */
    verify (ssid, fn) {

        let query = `Select COUNT(ssid) AS c FROM sessions WHERE ssid = ${ssid};`;
        pool.query(query, (error, result, fields) => {
            if (error){
                // TODO
                // handle error
            } else {
                if (result[0].c > 0){       // if ssid exists in sesh db
                    fn(true);
                } else {
                    fn(false);
                }
            }
        });
        
    }

    /**
     * Deletes a specific or this session
     * @param {number} ssid user session id
     */
    deleteSession (ssid) {
        let query = `DELETE FROM sessions WHERE ssid = ${ssid};`;
        pool.query(query, ( error , result, fields) => {
            if (error){
                // TODO
                // handle error
            }
        });
    }
}

module.exports = Session;