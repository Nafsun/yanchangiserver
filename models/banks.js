const mongoose = require("mongoose");
var moment = require("moment");

let banks = mongoose.model("banks", 
    mongoose.Schema({

        username: String,
        bankname: String,
        bankaccountnumber: String,
        bankaccountname: String,
        bankamount: String,

        date: {type:String, default: () => moment().utcOffset(1).format('LLLL')}

    }, {timestamps: true}));

module.exports = banks;