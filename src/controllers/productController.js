const Product = require("../models/productModel"); // Adjust the path as necessary
const wishlistModel = require("../models/wishlistModel");
const categoryModel = require("../models/categoryModel");
const productModel = require("../models/productModel");
const cartSchema = require("../models/cartModel");

exports.createProduct = async (req, res) => {
  try {
    const { name, mrp, quantity, desciption, category_id } = req.body;

    if (!name || !desciption || !mrp || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: name, mrp, quantity,desciption.",
      });
    }
    let imagePath = "";
    if (req.file) {
      imagePath = req.file.path; // Store the file path of the uploaded image
    } else {
      return res.status(400).json({
        success: false,
        message: "Image is required.",
      });
    }
    const newProduct = new Product({
      name,
      mrp,
      quantity,
      images: imagePath,
      category_id,
      desciption,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: savedProduct,
    });
  } catch (error) {
    console.error("Error during product creation:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
exports.getAllproducts = async (req, res) => {
  try {
    const products = await Product?.find({});
    console.log(products);

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error during product creation:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const Products = await productModel?.findOne({ _id: id });
    return res.status(200).json({ Products });
  } catch (error) {
    console.error("Error during product creation:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
exports.addToWishlist = async (req, res) => {
  const { productId } = req?.body;
  const user_id = req.user._id;
  console.log("user_id", user_id);
  console.log("productId", productId);

  try {
    const products = await Product?.find({ _id: productId });
    if (!products) {
      return res.status(404).json({ message: "Products Not Found" });
    }

    const addToWoshlist = await wishlistModel?.create({
      productId,
      user_id,
    });
    return res.status(200).json({ products });
  } catch (error) {
    console.error("Error during product creation:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.createCategory = async (req, res) => {
  const { category_Name, is_feature, is_disabled } = req.body;
  try {
    const addCategory = await categoryModel?.create({
      category_Name,
      is_feature,
      is_disabled,
    });
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: addCategory,
    });
  } catch (error) {
    console.error("Error during product creation:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
exports.getAllCategory = async (req, res) => {
  try {
    const category = await categoryModel?.find({ is_disabled: false }).limit(5);

    return res.status(200).json({ category });
  } catch (error) {
    console.error("Error during product creation:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const Products = await Product?.find({ category_id: id });

    return res.status(200).json({ Products });
  } catch (error) {
    console.error("Error during product creation:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.recentlyAddedProducts = async (req, res) => {
  try {
    const newAddedProducts = await productModel
      .find()
      .sort({ createdAt: -1 })
      .limit(4);
    const newAddedCategory = await categoryModel
      .find({
        is_feature: true,
        is_disabled: false,
      })
      .limit(4);

    return res
      .status(200)
      .json({ success: true, newAddedProducts, newAddedCategory });
  } catch (error) {
    console.error("Error fetching recently added products:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req?.body;
  console.log(quantity);

  const user_id = req.user?._id;
  try {
    const products = await cartSchema?.find({
      productId: productId,
      user_id: user_id,
    });

    if (products.length > 0) {
      const cartProducts = await cartSchema.findOneAndUpdate(
        { productId: productId, user_id },
        { $inc: { quantity: 1 } },
        { new: true }
      );
      return res.status(200).json({ message: "updated succefully" });
    }

    const addToCart = await cartSchema?.create({
      productId,
      user_id,
      quantity,
    });
    return res.status(200).json({ message: "Add to Cart" });
  } catch (error) {
    console.error("Error during product creation:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
exports.getCartProducts = async (req, res) => {
  const user_id = req.user?._id;
  try {
    const cartProducts = await cartSchema
      ?.find({ user_id })
      .populate("productId");

    if (cartProducts.length === 0) {
      return res.status(404).json({ message: "Cart products not found" });
    }
    const updatedCartProducts = cartProducts.map((cartItem) => {
      const productPrice = cartItem.productId.mrp;
      const quantity = cartItem.quantity;
      const totalProductPrice = productPrice * quantity;
      return {
        ...cartItem._doc,
        totalProductPrice,
      };
    });

    const totalAmount = updatedCartProducts.reduce((total, cartItem) => {
      return total + cartItem.totalProductPrice;
    }, 0);

    return res
      .status(200)
      .json({ cartProducts: updatedCartProducts, totalAmount });
  } catch (error) {
    console.error("Error during product creation:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateCartQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  const user_id = req.user?._id;
  try {
    const cartProducts = await cartSchema
      ?.findOneAndUpdate(
        { _id: productId, user_id },
        { $set: { quantity } },
        { new: true }
      )
      .populate("productId");
    if (!cartProducts) {
      return res.status(404).json({ message: "Products Not Found" });
    }
    return res.status(200).json({ message: "Product updated from cart" });
  } catch (error) {
    console.error("Error during product creation:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.deleteCartProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const cartProduct = await cartSchema.findByIdAndDelete(id);
    if (!cartProduct) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    return res.status(200).json({ message: "Product deleted from cart" });
  } catch (error) {
    console.error("Error during product creation:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
