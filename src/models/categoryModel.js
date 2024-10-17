const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category_Name: {
    type: String,
    required: true,
  },
  is_feature:{
    type: Boolean,
    default: false,
  },
  is_disabled:{
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("Category", categorySchema);
