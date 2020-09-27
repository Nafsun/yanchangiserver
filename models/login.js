const mongoose = require("mongoose");
var moment = require("moment");

let login = mongoose.model("login", 
    mongoose.Schema({

        username: {type:String, required:true},
        password: {type:String, required:true},
        createdby: { type: String, default: "no" }, //no if it is admin, or username of the admin that created him/her
        createbank: { type: String, default: "yes" },
        editbank: { type: String, default: "yes" },
        deletebank: { type: String, default: "yes" },
        createtransaction: { type: String, default: "yes" },
        edittransaction: { type: String, default: "yes" },
        deletetransaction: { type: String, default: "yes" },
        createrecieveorpay: { type: String, default: "yes" },
        editrecieveorpay: { type: String, default: "yes" },
        deleterecieveorpay: { type: String, default: "yes" },
        createexpense: { type: String, default: "yes" },
        editexpense: { type: String, default: "yes" },
        deleteexpense: { type: String, default: "yes" },
        createopeningbalance: { type: String, default: "yes" },
        editopeningbalance: { type: String, default: "yes" },
        deleteopeningbalance: { type: String, default: "yes" },

        date: {type:String, default: () => moment().utcOffset(1).format('LLLL')}

    }, {timestamps: true}));

module.exports = login;