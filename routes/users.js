/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/


/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/


const express = require("express");
const jwt = require("jsonwebtoken")
const { SECRET_KEY } = require("../config")
const expressError = require ("../expressError")
const User = require("../models/user");
const router = new express.Router();

router.get("/", async function (req, res, next){
    try{
        const users = await User.all()
        return res.json(users)
    }
    catch(e){
        next(e)
    }
})


router.get("/:username", async function(req, res, next ){
try{
    const username = req.params.username
    if (!username){
        throw new expressError("Please enter username!", 400)
    }
    const user = await User.get(username)
    if (user.length ==0){
        throw new expressError("No user of that name!", 404)
    }
    return res.json(user)

}
catch(e){
    next(e)
}

})

router.get("/:username/to", async function(req, res, next ){
    try{
        const username = req.params.username
        if (!username){
            throw new expressError("Please enter username!", 400)
        }
        const messages = await User.messagesTo(username)
        if (messages.length ==0){
            throw new expressError("No messages for that username!", 404)
        }
        return res.json(messages)
    
    }
    catch(e){
        next(e)
    }
    
    })



router.get("/:username/from", async function(req, res, next ){
    try{
        const username = req.params.username
        if (!username){
            throw new expressError("Please enter username!", 400)
        }
        const messages = await User.messagesFrom(username)
        if (messages.length ==0){
            throw new expressError("No messages from that username!", 404)
        }
        return res.json(messages)
    
    }
    catch(e){
        next(e)
    }
    
    })

module.exports = router