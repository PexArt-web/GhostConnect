const jwt = require("jsonwebtoken")
const User = require("../Models/Blueprint/userModel")
const SECRET = process.env.TOKEN_SECRET

const requireAuth = async (req, res, next) => {
    // destructing the authorization from the req.headers
    const { authorization } = req.headers 
    if(!authorization){
        return res.status(400).json({error: 'authorization required'})
    }
    // getting the token from the authorization
    const token = authorization.split(' ')[1]
    try {
        // verifying the token with jwt
       const {_id} = jwt.verify(token, SECRET)
        // verifying if the _id is database and hooking it up to the req.user for all routes to use
       req.user = await User.findOne({_id}).select('_id')
       next()
    } catch (error) {
        console.log(error)
        res.status(401).json({error: 'authorization error'})
    }


}

module.exports = requireAuth