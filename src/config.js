const mongoose = require("mongoose");
require("dotenv").config();

// Check if the env variable is loading correctly
console.log("⏳ Connecting to MongoDB...");
console.log("🔍 MONGO_URL from .env:", process.env.MONGO_URL);

// Attempt connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ MongoDB connection established successfully.");
})
.catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
});

// Schema
const user_scheme = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email:    { type: String, required: true },
  net_balance: { type: Number, required: true },

  earning: [{
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
  }],

  spent: [{
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
  }],

  //quiz_index: { type: Number, required: true }
});

// Model
const collection = mongoose.model("users", user_scheme);
module.exports = collection;
