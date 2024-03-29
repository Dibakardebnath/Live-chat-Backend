const express = require('express');
const User = require('../models/userModel');
const generateToken = require('../Config/generateToken');

const loginController=async(req,res)=>{
    const {name,password} = req.body;
    const user = await User.findOne({ name });

    console.log("user data", user)
    console.log(await user.matchPassword(password));

    if(user &&( await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token:generateToken(user._id),
        })
    
    }else{
        res.status(403)
        throw new Error("Invalid password and username")
    }
};


const registerController=async(req,res)=>{
    const {name,email,password} = req.body;
console.log(name,email,password)
    if(!name || !email || !password){
        res.send(400)
           throw Error("All necessary input fields have not been provided");     
    }

    //pre-existing user


    const userExist=await User.findOne({email})
    if(userExist){
        throw new Error("User already exists")
    }

    //userName is already taken

    const userNameExist=await User.findOne({name})
    if(userNameExist){
        throw new Error("UserName already exists")
    }


    // create an entry in the database


    const user= await User.create({name,email,password})
      if(user){
        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            token:generateToken(user._id),

        })
      }else{
        res.status(404,console.log(error));
        throw new Error("Registration error")
      }
};

module.exports = {loginController,registerController}