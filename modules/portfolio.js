

class Portfolio {

    constructor (data) {
        this.data = data;
    }

    getBalance () {
        let result = 0;
        for (let i in this.data){
            result += parseInt(this.data[i].value, 16);
        }
        return result / 1e18;
    }

}

module.exports = Portfolio;