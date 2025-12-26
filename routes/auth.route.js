const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const generateAcessToken = require('../services/generateToken');
const tokenCheck = require('../middleware/tokenCheck');
const roleCheck = require('../middleware/premissionCheck');

router.post('/login', async (req, res) => {
try{
    const {username, email, password} = req.body;

    const user = await User.findOne({email});

    if (!user){
        return res.status(400).json({
            success: false,
            input: {
                username,
                email,
                password
            },
            error: {
                field: "email",
                message: "user with this email does not exist",
                code: "EMAIL_DOES_NOT_EXIST"
            },
            result: null,
        });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect){
        return res.status(403).json({
            success: false,
            input: {
                username,
                email,
                password
            },
            error: {
                field: "password",
                message: "incorrect password",
                code: "INCORRECT_PASSWORD",
            },
            result: null,
        });
    }

    const token = generateAcessToken(user._id, user.roles);

    return res.status(200).json({
            success: true,
            input: {
                username,
                email,
                password: user.password
            },
            result: {
                token,
            },
            error: null
    });
    }catch(err){
        console.error(err.message);
        return res.status(500).json({message: err.messsage});
    }
});

router.post('/register', [
    check('username', 'username cannot be empty').notEmpty(),
    check('email', 'email cannot be empty').notEmpty(),
    check('password', 'password cannot be less than 6 symbols or more than 20').isLength({min: 6, max: 20})
] ,async (req, res) => {
    try{
        const {username, email, password} = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                input: {
                    username,
                    email,
                    password
                },
                error: errors["errors"],
                result: null,
            });
        }

        const checkUser = await User.findOne({email});

        if (checkUser){
            return res.status(400).json({
                success: false,
                input: {
                    username,
                    email,
                    password
                },
                error: {
                    field: "email",
                    message: "user with this email alredy exists",
                    code: "EMAIL_ALREADY_EXISTS"
                },
                result: null,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 7);
        const userRole = await Role.findOne({value: "USER"});
        const user = new User({username, email, password: hashedPassword, roles: [userRole.value]});

        await user.save();

        return res.status(201).json({
                success: true,
                input: {
                    username,
                    email,
                    password: hashedPassword
                },
                error: null
        });
    }catch(err){
        console.error(err.message);
        return res.status(500).json({message: err.message});
    }
});

router.post('/logout', async (req, res) => {
    try{

    }catch(err){
        console.error(err.message);
        return res.status(500).json({message: err.messsage});
    }
});

router.get('/users', tokenCheck, roleCheck(['ADMIN']), async (req, res) => {
    try{
        const users = await User.find({});
        return res.status(200).json(users);
    }catch(err){
        console.error(err.message);
        return res.status(500).json({message: err.messsage});
    }
})

module.exports = router;