const { default: mongoose } = require('mongoose');
require('dotenv').config(); // Load .env file

const mongo_url = process.env.MONGO_URL;

exports.MongoDbConnection = async () => {
  try {
    console.log("MongoDB URL:", mongo_url); // Check if MongoDB URI is loaded properly

    await mongoose.connect(mongo_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.connection.on('connected', () => {
      console.log('Connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    throw err; // Rethrow the error after logging it
  }
};
