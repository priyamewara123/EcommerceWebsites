const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
  },
  password:{
    type:String,
    required: true,
  },
  mobile_number: {
    type: String,
    unique: true,
    required: true,
  },
  email:{
    type:String,
    unique:true,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    required: true,
  }
});
module.exports = mongoose.model("users", userSchema);
