const mongoose = require("mongoose");
var moment = require("moment");

let membership = mongoose.model("membership", 
    mongoose.Schema({

        username: {type:String, required:true},
        gender: {type:String, required:true},
        category: {type:String, required:true},

        realamount: {type:String, required:true},
        
        IP: {type:String, required:true},
        amount: {type:String, required:true},
        appfee: {type:String, required:true},
        chargeResponseCode: {type:String, required:true},
        currency: {type:String, required:true},
        flwRef: {type:String, required:true},
        fraud_status: {type:String, required:true},
        paymentType: {type:String, required:true},
        status: {type:String, required:true},
        
        token: { type: String, default: 0 }, //username, realamount, IP, amount, appfee, chargeResponseCode, currency, flwRef, fraud_status, paymentType, status, date

        date: {type:String, default: () => moment().utcOffset(1).format('LLLL')}

    }, {timestamps: true}));

module.exports = membership;