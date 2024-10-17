const express = require('express');
const router = express.Router();
const { createProduct, getAllproducts, addToWishlist, createCategory, getAllCategory, getCategoryById, recentlyAddedProducts, getProductById, addToCart, getCartProducts, deleteCartProduct, updateCartQuantity } = require('../controllers/productController');
const upload = require("../middlewares/multer");
const { verifyToken, verifyTokenAdmin } = require('../middlewares/verifyToken');

// Route for creating a product
router.post('/createProducts',upload.single("images"), createProduct);
router.get('/getProducts', getAllproducts);
router.post('/addToWishlist',verifyToken,addToWishlist)
router.post('/addCategory',verifyTokenAdmin,createCategory)
router.get('/AllCategory',getAllCategory)
router.get('/recentlyAddedProducts',recentlyAddedProducts)
router.get('/CategoryById/:id',getCategoryById)
router.get('/getProductById/:id',getProductById)
router.post('/addToCart',verifyToken,addToCart)
router.get('/getCartProducts',verifyToken,getCartProducts)
router.delete('/removeCart/:id',verifyToken,deleteCartProduct)
router.put('/updateQty',verifyToken,updateCartQuantity)

module.exports = router;
