/* eslint-disable */
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express();

// —— CORS configuration —— //
const WHITELIST = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://recipe-generator-six-coral.vercel.app"
];
const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (e.g. Postman, curl)
    if (!origin) return callback(null, true);

    if (WHITELIST.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`Blocked CORS request from origin: ${origin}`);
    return callback(new Error("Not allowed by CORS"), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400,
};

// apply CORS to all routes
app.use(cors(corsOptions));
// also handle pre-flight across the board
app.options("*", cors(corsOptions));

// parse JSON bodies
app.use(express.json());

// —— MongoDB connection —— //
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// —— Routes —— //
const recipesRoute = require("./routes/recipes");
app.use("/recipes", recipesRoute);

app.post("/ai-recipe", async (req, res) => {
  // you no longer need to re-set CORS headers here
  try {
    const { ingredients } = req.body;
    if (!Array.isArray(ingredients)) {
      return res.status(400).json({ error: "Ingredients must be an array" });
    }

    const ingredientsString = ingredients.join(", ");
    const response = await axios.post(process.env.N8N_WEBHOOK_URL, {
      ingredients: ingredientsString,
    });

    return res.json({ recipe: response.data });
  } catch (error) {
    console.error("Error generating recipe:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return res.status(500).json({ error: "Failed to generate recipe" });
  }
});

// health check
app.get("/", (_req, res) => res.send("API is running"));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
