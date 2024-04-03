const express = require('express');
const protect = require('../middleware/authMiddleware');
const { allMessages, sendMessage } = require('../Controllers/messageControllers');


const router=express.router();

router.route("/:chatId").get(protect,allMessages);
router.route("/").post(protect,sendMessage);

