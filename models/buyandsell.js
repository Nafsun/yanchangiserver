const mongoose = require("mongoose");
var moment = require("moment");

let buyandsell = mongoose.model("buyandsell", 
    mongoose.Schema({

        username: String,
        amount1: String,
        rate1: String,
        ngn1: String,
        supplier: String,
        supplieraccountno: String,
        customer: String,
        customeraccountno: String,
        rate2: String,
        ngn2: String,
        profit: String,

        date: {type:String, default: () => moment().utcOffset(1).format('LLLL')}

    }, {timestamps: true}));

module.exports = buyandsell;