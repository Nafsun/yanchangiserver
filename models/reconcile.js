const mongoose = require("mongoose");
var moment = require("moment");

let reconcile = mongoose.model("reconcile", 
    mongoose.Schema({

        username: String,
        description: String,
        amount: String,
        sendorrecieved: String,
        from: String, //internal or external
        bankname: String, //From
        bankaccountnumber: String,
        bankaccountname: String,
        to: String, //internal or external
        bankname2: String, //To
        bankaccountnumber2: String,
        bankaccountname2: String,
        date: {type:String, default: () => moment().utcOffset(1).format('LLLL')}

    }, {timestamps: true}));

module.exports = reconcile;