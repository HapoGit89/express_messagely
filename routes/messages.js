/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/


const express = require("express");
const { SECRET_KEY } = require("../config")
const expressError = require ("../expressError")
const User = require("../models/user");
const Message = require("../models/message")
const router = new express.Router();
const jwt = require ("jsonwebtoken")


router.get("/:id/", async function(req,res, next){
    try {
        const id = req.params.id
        const result = await Message.get(id)
        if (result.length==0){
            throw new expressError("No Message for that id", 404)
        }
        return res.json(result)
    }
    catch(e){
        return next(e)

    }

})


router.post("/", async function(req, res, next){
    try{
        const _token = req.body._token
        if (!_token){
            throw new expressError("Unathorized",  400)
        }        console.log(_token)
        const payload = jwt.verify(_token, SECRET_KEY)
        const from_username = payload.username
        const to_username = req.body.to_username
        const body = req.body.body
        const result = await Message.create({from_username, to_username, body})
        return res.status(201).json(result)
    }
    catch(e){
        next(e)
    }
} )


router.post("/:id/read/", async function(req, res, next){
    try{
        const id= req.params.id
        const _token = req.body._token
        const payload = jwt.verify(_token, SECRET_KEY)
        const username = payload.username
        console.log(username)
        const message = await Message.get(id)
        const to_username = message.to_user.username
        console.log(to_username)
        if (username != to_username){
            throw new expressError("Unathorized!", 400)
        }
        const result = await Message.markRead(id)
        return res.status(201).json(result)
    }
    catch(e){
        next(e)
    }
} )





module.exports = router;