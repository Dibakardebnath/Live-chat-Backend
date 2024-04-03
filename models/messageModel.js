const mongoose = require("mongoose");

const messageModel = mongoose.Schema({
    sender : {
        type:mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    reciever :  {
        type:mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    chat :{
        type:mongoose.Schema.Types.ObjectId,
        ref : "Chat",
    }
},
{
    timeStamp : true,
})

const Messages = mongoose.model("Messages", messageModel)
module.exports = Messages