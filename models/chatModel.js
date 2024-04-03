const mongoose = require("mongoose");

const chatModel = mongoose.Schema({
    chatName:{type:"string"},
    isGroupChat:{type:"boolean"},
    users : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ],
    latestMessage : {
        type:mongoose.Schema.Types.ObjectId,
        ref : "Message"
    },
    groupAdmin :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
},{
    timeStamp : true,
})

const chat = mongoose.model("Chat", chatModel);
module.exports = chat;



// const mongoose = require('mongoose')

// const connection=mongoose.connect("mongodb+srv://ddibakar190:KQG1emnlC9eLL0vL@cluster0.x5sxwu5.mongodb.net/Project")

// module.exports ={connection}

