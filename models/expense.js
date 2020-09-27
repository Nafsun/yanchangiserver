const mongoose = require("mongoose");
var moment = require("moment");

let expense = mongoose.model("expense", 
    mongoose.Schema({

        username: String,
        amount: String,
        description: String,
        bankname: String,
        bankaccountnumber: String,
        bankaccountname: String,
        date: {type:String, default: () => moment().utcOffset(1).format('LLLL')}

    }, {timestamps: true}));

module.exports = expense;