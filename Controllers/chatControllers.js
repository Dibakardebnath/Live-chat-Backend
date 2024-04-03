const chat = require("../models/chatModel");
const User = require("../models/userModel");


const accessChat=async(req,res) => {
    const { userId}=req.body;

    if(!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }
    var isChat=await chat.find({
      isGroupChat:false,
      $and:[
        {users:{$elemMatch:{$eq:req.user._id}}},
        {users:{$elemMatch:{$eq:userId}}},
      ],
    }).populate("users","-password")
    .populate("latestMessage");

    isChat=await User.populate(isChat,{
        path:"latestMessage.sender",
        select:"name email"
    });
    if(isChat.length > 0){
        res.send(isChat[0]);
    } else{
        var chatData={
            chatName:"sender",
            isGroupChat:false,
            users:[req.user._id, userId],
        };
        try {
            const createdChat=await chat.create(chatData);
            const FullChat = await chat.findOne({ _id: createdChat._id }).populate("users", "-password")
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
};
const fetchChats=async(req,res) => {
    try {
        chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate("users", "-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updatedAt:-1})
        .then(async(results)=>{
            results=await User.populate(results,{
                path:"latestMessage.sender",
                select:"name email"
            });
            res.status(200).send(results);
        })
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
};
const fetchGroups=async(req,res) => {
    try {
        const allGroups = await chat.where("isGroupChat").equals(true);
        res.status(200).send(allGroups);
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
};
const createGroupChat=async(req,res) => {
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message:"Data is insufficient"});
    }
    var users=JSON.parse(req.body.users)
    console.log("chatController/createGroups:",req);
    users.push(req.user);

    try {
        const groupChat=await chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user,
        });
        const fullGroupChat=await chat.findOne({_id:groupChat._id})
        .populate("users", "-password")
        .populate("groupAdmin","-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
};
const groupExit=async(req,res) => {
    const {chatId,userId}=req.body;
   
    const removed =await chat.findByIdAndUpdate(
        chatId,
        {
          $pull: { users: userId },
        },
        {
          new: true,
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password");

    if(!removed){
        res.status(403);
        throw new Error("chat not found");

    }else{
        res.json(removed);
    }
};
const addSelfToGroup=async(req, res) =>{
    const {chatId,userId}=req.body;
   
    const add =await chat.findByIdAndUpdate(
        chatId,
        {
          $push: { users: userId },
        },
        {
          new: true,
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password");

    if(!add){
        res.status(403);
        throw new Error("chat not found");

    }else{
        res.json(add);
    }
}
module.exports ={accessChat, fetchChats, fetchGroups ,createGroupChat, groupExit,addSelfToGroup}