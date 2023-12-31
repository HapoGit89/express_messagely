/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */


const express = require("express");
const jwt = require("jsonwebtoken")
const { SECRET_KEY } = require("../config")

const expressError = require ("../expressError")

const User = require("../models/user");

const router = new express.Router();

router.post("/register/", async function(req,res, next){
    try {
        const {username, password, first_name, last_name, phone} = req.body
        if (!username || !password || !first_name || !last_name || !phone) {
            throw new expressError("Please enter username, password, first name, last name and phone!", 400)
        }
        console.log(username)
        const result = await User.register(username, password, first_name, last_name, phone)
        if (!result){
            throw new expressError("Error Registering!", 400)
        }
        return res.json({"message": "Registered!"})


    }
    catch(e){
        return next(e)

    }

})


router.post("/login/", async function(req,res, next){
    try {
        const {username, password} = req.body
        if (!username || !password) {
            throw new expressError("Please enter username and password!", 400)
        }
        const result = await User.authenticate(username, password)
        if (!result){
            throw new expressError("False credentials!", 400)
        }
        const token = jwt.sign({username}, SECRET_KEY)
        User.updateLoginTimestamp(username)
        return res.json({token})


    }
    catch(e){
        return next(e)

    }

})


module.exports = router;