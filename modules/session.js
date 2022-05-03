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

                } else {
                    fn(result[result.length - 1].ssid);
                }
            });
        }
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