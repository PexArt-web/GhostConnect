const User = require("../Models/usersModel")

const signup = async ( req, res) =>{
   const { username, email, password } = req.body
   try {
      const user = await User.signup(username, email, password)
      res.status(200).json({message: user.username + "now created", info: user})
   } catch (error) {
      res.status(400).json({error: error.message})
   }
}
 
const login = async (req, res) =>{
   try {
      res.status(200).json({message:"comming soon!"})
   } catch (error) {
      res.status(400).json({error: error.message})
   }
}

module.exports = {
   signup,
   login
}