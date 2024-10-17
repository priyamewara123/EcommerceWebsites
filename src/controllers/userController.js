const users = require("../models/userModel");
const { setUser, getUser } = require("../helper/jwtToken");
const bcrypt = require("bcrypt");
const wishlist = require("../models/wishlistModel");

const signUp = async (req, res) => {
    try {
        const { user_name, password, mobile_number, role, email } = req.body;
        if (!user_name || !mobile_number || !email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "Missing required fields" });
        }
        const user = await users.findOne({
            $or: [{ email: email }, { mobile_number: mobile_number }],
        });
        if (user) {
            return res.status(404).json({
                success: false,
                message: "user mobile number or email already exists",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userDetails = await users.create({
            user_name,
            mobile_number,
            email,
            role:role||"user",
            password: hashedPassword,
        });
        res.status(201).json({
            message: "User registered successfully",
            data: userDetails,
        });
    } catch (error) {
        console.error("Error during user creation:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
const userLogin = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "Missing required fields" });
        }
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Please Create a account" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Password Authentication failed" });
        }
        const token = setUser({ user });
        res.cookie('token', token, {
            httpOnly: true,
            secure:true,
            sameSite: 'Lax', 
        });
        res.status(200).json({ data: user });
    } catch (error) {
        console.log(error);

        res.status(500).json({ error: "Login failed" });
    }
};
const getWishlistProducts= async (req, res) => {
    const user_id = req.user?._id;
    try {
        const AllWishlist = await wishlist.find({ user_id }).populate('property_id').select('-user_id');
        return res
            .status(200)
            .json({ success: true, message: "wishlist Properties", data: AllWishlist });

    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Server error", error: error.message });
    }
}



module.exports = {
    signUp,
    userLogin,
    getWishlistProducts
};
