const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next)=>{
    const authHeader = req.headers.authorization;

    if(authHeader){
        const token = authHeader.split(" ")[1];
        //means bearer ftfyfhf => space then the next index i.e token
        //double space to be precise

        jwt.verify(token, process.env.JWT_SEC, async(err, user)=>{
            if(err){
                return res.status(401).json({message: 'Invalid token'})
            }
            req.user = user;
            next();
        })
    }
};

const verifyAndAuth = (req, res, next) => {
     verifyToken(req, res, ()=>{
        if(req.user.id || req.user.isAdmin){
            next();
        } else{
            return res.status(403).json({message: 'You are not authorized to access'})
        }
     })   
};

const verifyAgent = (req, res, next) => {
    verifyToken(req, res, ()=>{
       if(req.user.isAgent || req.user.isAdmin){
           next();
       } else{
           return res.status(403).json({message: 'You are not authorized to access'})
       }
    })   
};

module.exports = {verifyToken, verifyAndAuth, verifyAgent}