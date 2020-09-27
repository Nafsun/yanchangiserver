const mongoose = require("mongoose");
var moment = require("moment");

let recieveorpay = mongoose.model("recieveorpay", 
    mongoose.Schema({

        username: String,
        amount: String,
        chooseclient: String,
        recievedorpay: String, //drop down - recieved or pay
        fromorto: String,
        bankname: String,
        bankaccountnumber: String,
        bankaccountname: String,
        accountnumber: String,
        date: {type:String, default: () => moment().utcOffset(1).format('LLLL')}

    }, {timestamps: true}));

module.exports = recieveorpay;