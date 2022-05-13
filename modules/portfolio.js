

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

    getChart () {
        let r = {}
        //console.log(this.data[0].date.getMonth());
        let range = this.#monthSort();

        return range;
    }

    #monthSort () {
        let range = {};
        let curr = new Date(this.data[0].date);
        let end = new Date();
        while (curr <= end){
            let t = '' + curr.getMonth() + "-" + curr.getFullYear()
            range[t] = [];
            if (curr.getMonth() == 11){
                curr.setMonth(0);
                curr.setYear(curr.getFullYear() + 1);
            } else {
                curr.setMonth(curr.getMonth() + 1);
            }
        }
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