const {getUser} =require("../helper/jwtToken")

const verifyTokenUser = async (req, res,next) => {
    try {
        const {token}=req.cookies;

        if(!token){
            return res.status(401).json({message:"UnAuthorized"});
        }
        const data = getUser(token)
        if(data.user.role != "user"){
            return res.status(401).json({message:"UnAuthorized"});
        }
        req.user=data.user
        next();
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
    }
  };
  const verifyTokenAdmin = async (req, res,next) => {
    try {
      const {token}=req.cookies;

      if(!token){
          return res.status(401).json({message:"UnAuthorized"});
      }
        const data = getUser(token)
        if(data.user.role !== "admin"){
          return res.status(401).json({message:"UnAuthorized"});
      }
        if(!data?.user){
            return res.status(400).json({message:"UnAuthorized"});
        }
        req.user=data.user
        next();
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
    }
  };
  const verifyToken = async (req, res,next) => {
    try {
      const {token}=req.cookies;

      if(!token){
          return res.status(401).json({message:"UnAuthorized"});
      }
        const data = getUser(token)

        if(!data?.user){
            return res.status(400).json({message:"UnAuthorized"});
        }
        req.user=data.user
        next();
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
    }
  };
  module.exports = {verifyToken,verifyTokenAdmin,verifyTokenUser}