const mongoose = require("mongoose");
var moment = require("moment");

let verifyaccount = mongoose.model("verifyaccount", 
    mongoose.Schema({

        username: {type:String, required:true}, //known
        firstname: {type:String, required:true}, //known
        lastname: {type:String, required:true}, //known
        email: {type:String, required:true}, //known
        phoneno: {type:String, required:true}, //known
        category: {type:String, required:true}, //known
        gender: {type:String, required:true}, //known
        dateofbirth: {type:String, required:true}, //known
        country: {type:String, required:true}, //known
        state: {type:String, required:true}, //known
        localgovt: {type:String, required:true}, //known

        homeaddress: String,
        homelocationx: String, //known
        homelocationy: String, //known

        businessname: String, //known
        shopaddress: String, 
        shoplocationx: String, //known
        shoplocationy: String, //known

        yourpicture: {type:String, required:true}, 
        identificationname: {type:String, required:true}, //nic, voterscard, passport
        identificationpicture: {type:String, required:true},
        verified: { type: String, default: "no" },
        seen: { type: String, default: 0 },
        date: {type:String, default: () => moment().utcOffset(1).format('LLLL')}

    }, {timestamps: true}));

module.exports = verifyaccount;