const mongoose = require("mongoose");
var moment = require("moment");

let feedback = mongoose.model("feedback", 
    mongoose.Schema({

        username: String,
        sentmessage: String,
        recievedmessage: String,
        date: {type:String, default: () => moment().utcOffset(1).format('LLLL')}

    }, {timestamps: true}));

module.exports = feedback;