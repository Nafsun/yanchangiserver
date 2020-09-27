const mongoose = require("mongoose");
var moment = require("moment");

let signup = mongoose.model("signup",
    mongoose.Schema({

        fullname: String,
        email: String,
        phoneno: String,
        country: String,
        state: String,
        localgovt: String,
        dateofbirth: String,
        gender: String,
        username: String,
        businessname: String,
        picture: String,

        emailcodesent: String,
        emailverify: { type: String, default: "no" }, //if yes, it is verified

        forgotpasswordvcode: { type: String, default: "no" }, //code sent to the email of the user
        forgotpasswordcodesent: { type: String, default: "no" }, //if code is sent to the users email
        forgotpasswordverified: { type: String, default: "no" }, //if yes, email is verified
        forgotpasswordtoken: String,

        subscribtion: Object,

        date: { type: String, default: () => moment().utcOffset(1).format('LLLL') }

    }, { timestamps: true }));

module.exports = signup;