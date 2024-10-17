const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { MongoDbConnection } = require('./helper/db');
require("dotenv").config()
const app = express();
app.use(cors({
  origin: ["https://famous-froyo-47930d.netlify.app", "http://localhost:5173"],
  credentials: true, 
}));
app.use(bodyParser.json());
app.use(cookieParser());
const PORT = process.env.PORT || 3000;
const userRoutes = require("./routes/userRoutes")
const productRoutes = require("./routes/productRoutes")

const path = require('path');
const uploadDir = path.join(__dirname, '..', 'uploads'); // Go one level up from src

app.use('/uploads', express.static(uploadDir));
app.use("/api/auth",userRoutes)
app.use("/api/products",productRoutes)
MongoDbConnection()
app.get('/', (req,res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});