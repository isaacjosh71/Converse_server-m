const User = require('../models/user');
const CryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');



module.exports = {
    createUser: async (req, res)=> {
        const user = req.body;

        try{
            //first check if user exist with firebase
            await admin.auth().getUserByEmail(user.email);
            return res.status(400).json({
                message: 'User already exist'
            });
        } catch(error){
            //firebase error code
            if(error.code === 'auth/user-not-found'){
                const userResponse = await admin.auth().createUser({
                    email: user.email,
                    password: user.password,
                    emailVerified: false,
                    disabled: false
                })
                //print firebase user uid
                console.log(userResponse.uid);

                //then create user for mongo
                const newUser = new User({
                    uid: userResponse.uid,
                    username: user.username,
                    email: user.email,
                    password: CryptoJs.AES.encrypt(user.password, process.env.SECRET).toString()
                    //encrypt password before sending
                });

                try{
                    await newUser.save();
                    const userToken = jwt.sign({
                        id: newUser._id,
                        isAdmin: newUser.isAdmin,
                        isAgent: newUser.isAgent,
                        uid: newUser.uid
                    }, process.env.JWT_SEC, {expiresIn: '21d'});
                    const {password, isAdmin, ...others} = newUser._doc
                    
                    res.status(201).json({...others, userToken})
                }catch(error){
                    console.log(error);
                    res.status(500).json({error: 'An error occured while creating account'}) 
                }
            }

        }
    },

    loginUser: async (req, res)=> {
        try {
            const user = await User.findOne({
                email: req.body.email}, {__v: 0, createdAt: 0, updatedAt: 0, skills:0});
                if(!user){
                    return res.status(400).json({
                        message: 'User not found'
                    });
                }

                const decryptedPassword = CryptoJs.AES.decrypt(user.password, process.env.SECRET);
                const depassword = decryptedPassword.toString(CryptoJs.enc.Utf8);

                if(depassword !== req.body.password){
                    res.status(400).json({
                        message: 'Invalid password'
                    })
                }

                //if match, create token
                const userToken = jwt.sign({
                    id: user._id,
                    isAdmin: user.isAdmin,
                    isAgent: user.isAgent,
                    uid: user.uid
                }, process.env.JWT_SEC, {expiresIn: '21d'});

                const {password, isAdmin, ...others} = user._doc

                res.status(200).json({...others, userToken})

        } catch (error) {
            res.status(500).json({error: 'An error occured while creating account'}) 
        }
    },


    updatePassword: async(req, res) =>{

        const user = await User.findOne({
            email: req.body.email}, {__v: 0, createdAt: 0, updatedAt: 0, skills:0, email: 0});
            if(!user){
                return res.status(400).json({
                    message: 'User not found'
                });
            }

        try {
            await User.findOneAndUpdate(user._id,
                {__v: 0, createdAt: 0, updatedAt: 0, skills:0},
                {$set: 
                    // CryptoJs.AES.encrypt(
                    req.body.password
                    // , process.env.SECRET).toString()
                }, 
                {new:true})
                res.status(200).json({status: true})
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    },
};

