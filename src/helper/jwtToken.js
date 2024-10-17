const jwt=require('jsonwebtoken')
require('dotenv').config();
const secret=process.env.SECRET_KEY

function setUser(users) {
    return jwt.sign(users,secret);
}
function getUser(token) {
    return jwt.verify(token,secret);
}
module.exports={
    setUser,
    getUser
}