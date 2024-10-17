const mongoose = require("mongoose");
const wishlistSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true, 
  },
  user_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true, 
  }
});
module.exports = mongoose.model("wishlist", wishlistSchema);
