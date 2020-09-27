const mongoose = require("mongoose");
var moment = require("moment");

let help = mongoose.model("help", 
    mongoose.Schema({

        username: String,
        sentmessage: String,
        recievedmessage: String,
        date: {type:String, default: () => moment().utcOffset(1).format('LLLL')}

    }, {timestamps: true}));

module.exports = help;