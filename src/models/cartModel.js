const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true, 
  },
  user_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true, 
  },
  quantity:{
    type: Number,
    required: true,
    default: 1,
  }
});
module.exports = mongoose.model("cart", cartSchema);
