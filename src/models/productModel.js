const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  mrp:{
    type: Number,
    required: true,
  },
  quantity:{
    type: Number,
    required: true,
    default:0
  },
  desciption:{
    type: String,
    required: true,
  },
  images: [{
    type: String, 
  }],
  category_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: true, 
  }
},
{
  timestamps: true,
});

module.exports = mongoose.model("products", productSchema);
