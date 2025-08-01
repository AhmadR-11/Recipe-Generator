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
    if (!origin) return callback(null, true);
    if (WHITELIST.includes(origin)) return callback(null, true);
    console.warn(`Blocked CORS request from origin: ${origin}`);
    return callback(new Error("Not allowed by CORS"), false);
  },
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization","X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

// —— MongoDB connection —— //
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// —— Mount your routers —— //
const recipesRoute = require("./routes/recipes");
app.use("/recipes", recipesRoute);

app.post("/ai-recipe", async (req, res) => {
  // … your existing AI-recipe logic …
});

// health check
app.get("/", (_req, res) => res.send("API is running"));

// ——— DEBUG: print every registered route ———
console.log("🔍 Registered routes:");
app._router.stack.forEach((layer) => {
  if (layer.route && layer.route.path) {
    // top-level route
    const methods = Object.keys(layer.route.methods)
      .map(m => m.toUpperCase())
      .join(",");
    console.log(`  [route]  ${methods}  ${layer.route.path}`);
  } else if (layer.name === "router" && layer.handle.stack) {
    // mounted router
    layer.handle.stack.forEach((handler) => {
      if (handler.route && handler.route.path) {
        const methods = Object.keys(handler.route.methods)
          .map(m => m.toUpperCase())
          .join(",");
        console.log(`  [router] ${methods}  ${handler.route.path}`);
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
