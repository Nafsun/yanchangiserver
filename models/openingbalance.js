const mongoose = require("mongoose");
var moment = require("moment");

let openingbalance = mongoose.model("openingbalance", 
    mongoose.Schema({

        username: String,
        amount: String,
        chooseclient: String,
        name: String,
        accountnumber: String,
        date: {type: String, default: () => moment().utcOffset(1).format('LLLL')}

    }, {timestamps: true}));

module.exports = openingbalance;