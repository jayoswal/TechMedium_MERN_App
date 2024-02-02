// include jwt and secret key
const jwt = require('jsonwebtoken')
const { JWT_SECRET_KEY } = require('../config')

// include mongoose and UserModel model
const mongoose = require('mongoose');
const UserModel = mongoose.model('UserModel')

module.exports = (req, res, next) => {
    // check if auth in headers
    const {authorization} = req.headers;
    if(!authorization) {
        return res.status(401).json({
            error: "UnAuthorized"
        })
    }

    // extract token
    const token = authorization.replace("Bearer ", "");


    // verify token and extract _id
    jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
        if(error) {
            return res.status(401).json({
                error: "Unauthorized"
            })
        }
        
        // extract _id
        const _id = payload._id;

        // find user matching id
        UserModel.findById(_id)
        .then((user) => {
            if(!user){
                return res.status(401).json({
                    error: "Unauthorized"
                })
            }

            // forward user in req and call next
            req.user = user
            next();

        })
        .catch((error) => {
            console.log(error)
            return res.status(500).json({
                error: "Error..."
            })
        });
    })

}