const express = require('express');
const User = require('../models/userModel');

const loginController=()=>{};

const registerController=async(req,res)=>{
    const {name,email,password} = req.body;

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
      
};