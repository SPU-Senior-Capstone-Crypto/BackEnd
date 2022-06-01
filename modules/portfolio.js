const pool = require("./db");

class Portfolio {

    constructor (data) {
        this.data = data;
    }

    getBalance () {
        let result = 0;
        for (let i in this.data){
            result += this.data.shares * parseInt(this.data[i].value, 16);
        }
        return result / 1e18;
    }

    /**
     * Finds the amount of shares owned in the portfolio
     *  with the given property id
     * @param {Number} id Property id
     * @returns Number of shares owned
     */
    getShares (id) {
        let n = 0;
        for (let i in this.data){
            if (this.data[i].property_id == id){
                n += this.data[i].shares;
            }
        }
        return n
    }
    // {
    //     type: 'line',
    //     data: {
    //         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    //         datasets: [{
    //             label: '# of Votes',
    //             data: [12, 19, 3, 5, 2, 3],
    //             backgroundColor: [
    //                 'rgba(255, 99, 132, 0.2)',
    //                 'rgba(54, 162, 235, 0.2)',
    //                 'rgba(255, 206, 86, 0.2)',
    //                 'rgba(75, 192, 192, 0.2)',
    //                 'rgba(153, 102, 255, 0.2)',
    //                 'rgba(255, 159, 64, 0.2)'
    //             ],
    //             borderColor: [
    //                 'rgba(255, 99, 132, 1)',
    //                 'rgba(54, 162, 235, 1)',
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(75, 192, 192, 1)',
    //                 'rgba(153, 102, 255, 1)',
    //                 'rgba(255, 159, 64, 1)'
    //             ],
    //             borderWidth: 1
    //         }]
    //     },
    //     options: {
    //         scales: {
    //             y: {
    //                 beginAtZero: true
    //             }
    //         }
    //     }
    // }

    // [
    //     RowDataPacket {
    //       property_id: 1,
    //       transaction_id: 2,
    //       user_id: 1,
    //       shares: 1,
    //       principle: '0x16345785d8a0000',
    //       date: 2022-05-10T12:14:19.000Z,
    //       hash: '0x527abc2980e74e763bf69fefceeaa8b3fac791849ded9a4f93183551535384aa',
    //       sender: '0x846c5b8da1e9d9d4f1b68397bb55eb43e18db800',
    //       recipient: '0x952d6497fe49c808004cce2e3d8e8526fcf61366',
    //       property_name: 'test_prop',
    //       address: '1234 n ave',
    //       value: '0x16345785d8a0000',
    //       total_shares: 10000,
    //       outstanding_shares: 10000
    //     },
    //     RowDataPacket {
    //       property_id: 1,
    //       transaction_id: 3,
    //       user_id: 1,
    //       shares: 1,
    //       principle: '0x16345785d8a0000',
    //       date: 2022-05-10T12:16:20.000Z,
    //       hash: '0x527abc2980e74e763bf69fefceeaa8b3fac791849ded9a4f93183551535384aa',
    //       sender: '0x846c5b8da1e9d9d4f1b68397bb55eb43e18db800',
    //       recipient: '0x952d6497fe49c808004cce2e3d8e8526fcf61366',
    //       property_name: 'test_prop',
    //       address: '1234 n ave',
    //       value: '0x16345785d8a0000',
    //       total_shares: 10000,
    //       outstanding_shares: 10000
    //     }
    // ]

    /**
     * Generates the data for a line chart
     * @param {callback} fn callback function
     */
    createChart (fn) {
        if (this.data.length == 0){
            fn([]);
        }
        let properties = this.getProperties();

        let s = ""
        for (let i in properties){
            s += properties[i] + ",";
        }

        s = s.slice(0,-1);


        let query = `SELECT * FROM price_history WHERE property_id in (${s})`;

        pool.query(query, (err, res, fields) => {
            if (err){
                fn({err:true});
            } else {
                let range = this.#monthSort(); // time range of all transactions for user
                let data = this.#calcHistory(range, res);   // data for chart (balance vs time)
                let labels = [];
                for (let i in range){
			let a = i.split('-');
			let n = Number(a[0]) + 1;
                	labels.push('' + n + '-' + a[1]);
                }

                let r = {
                    type : 'line',
                    data : {
                        labels : labels,
                        datasets : [
                            {
				range : range,
                                label : 'Eth Balance',
                                data : data,
                                tension : 0.1,
                                borderWidth : 4,
                            }
                        ]
                    },
                    options : {
                        scales : {
                            y : {
                                beginAtZero : true,
                                grace : data[data.length - 1] * 1.2
                            }
                        }
                    }
                    
                }   
                fn(r);
            }
        }); 
    }

    /**
     * Gathers property meta data for properties owned by user
     * @param {callback} fn callback function
     */
    createCards (fn) {
        let props = this.getProperties();
        if (props.length > 0){
            let s = '(';
            for (let i in props){
                s += props[i] + ',';
            }
            s = s.slice(0, -1);
            s += ')';

            let query = `SELECT * FROM property
                        INNER JOIN property_meta using (property_id)
                        HAVING property_id in ${s}`;

            pool.query(query, (error, result, fields) => {
                if (error) {
                    fn(error);
                } else {
                    fn(result);
                }
            });
        } else {
            fn(new Error('No properties'))
        }
    }

    /**
     * gets all property id's owned by user
     * @returns array (set) of property_id's owned by profile
     */
    getProperties () {
        let properties =  [];
        for (let i in this.data){
            let p = this.data[i].property_id
            if (!properties.includes(p)){   // if p already exists
                properties.push(p);
            }
        }

        return properties;
    }

    /**
     * Calcualtes the historical value of user's protfolio 
     * uses transactions and historical data
     * @param {object} range organized transactional data
     * @param {array} history historical pricing for properties     
     * @returns array of finacial records for points on chart
     */
    #calcHistory (range, history) {
        let props = this.getProperties();
        let r = {};

        // initalize JSON with list of properties
        for (let i in props){
            r[props[i]] = {
                shares : 0  // init with no shares owned
            }
        }
        let x = 0;
        // iter history to find time that matches with transactions
        for (let i in history){
            // t = MM-YYYY of property history entry
            let t = '' +  history[i].date.getMonth() + '-' + history[i].date.getFullYear();
            let p = history[i].property_id;

            //finds given transactions in the same month and with same property
            for (let j in range[t]){
                if (range[t][j].property_id == p){
                    r[p].shares += range[t][j].shares;   // adds shares to property 
                }
            }
            // current balance = shares * price at time
            x =  r[p].shares * parseInt(history[i].value, 16) / 1e18
            r[p][t] = x;
        }

        let data = [];
        let index = 0;

        // sum value of all properties by time series
        for (let i in r){
            index = 0;
            for (let j in r[i]){
                if (j != 'shares'){
                    if (index >= data.length){  // if first time through array
                        data.push(r[i][j]);
                        index++;
                    } else {
                        data[index] += r[i][j]; // add to existing total
                        index++;
                    }
                }
            }
            
        }
        return data;
    }

    // 50000000000000000
    // 60000000000000000
    // 75000000000000000
    // 80000000000000000
    // 90000000000000000
    // 100000000000000000

    // 50000000000000000,
    // 50000000000000000,
    // 125000000000000000,
    // 3965000000000000000,
    // 12605000000000000000,
    // 22205000000000000000

    /**
     * Organizes transaction in a list starting at the first transaction through today
     * Transactions are assigned under their repsective month/year of purchase.
     * @returns organized list of transactions by date
     */
    #monthSort () {
        let range = {};
        let curr = new Date(this.data[0].date);
        let end = new Date();
        // iterate from first t to today by month
        // create an entry in range for each month/year combo passed
        while (curr <= end){
            let t = '' + curr.getMonth() + "-" + curr.getFullYear()
            range[t] = [];
            if (curr.getMonth() == 11){ // if December
                curr.setMonth(0);
                curr.setYear(curr.getFullYear() + 1);
            } else {
                curr.setMonth(curr.getMonth() + 1);
            }
        }
//        range['' + curr.getMonth() + "-" + curr.getFullYear()] = [];
        // allocate transaactions under their respective month/year
        for (let i in this.data){
            let t = '' + this.data[i].date.getMonth() + "-" + this.data[i].date.getFullYear()
            if (!range[t]){ // if new month
                range[t] = [];
            }
            range[t].push(this.data[i]);
        }

        return range;
    }
}

module.exports = Portfolio;
