const mongoose = require("mongoose");
var moment = require("moment");

let payment = mongoose.model("payment", 
    mongoose.Schema({

        firstname: {type:String, required:true},
        lastname: {type:String, required:true},
        email: {type:String, required:true},
        phoneno: {type:String, required:true},
        username: {type:String, required:true},
        gender: {type:String, required:true},
        category: {type:String, required:true},
        amount: {type:String, required:true},
        bankname: {type:String, required:true},
        accountname: {type:String, required:true},
        accountnumber: {type:String, required:true},
        paid: {type:String, default: "no"},
        paiddate: String,
        token: { type: String, default: 0 }, //username, amount, bankname, accountname, accountnumber, date
        seen: { type: String, default: 0 },
        date: {type:String, default: () => moment().utcOffset(1).format('LLLL')}

    }, {timestamps: true}));

module.exports = payment;