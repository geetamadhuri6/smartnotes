import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());



// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);


// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");
  })
  .catch((err) => {
    console.error("MongoDB connection failed ❌", err);
  });


// ✅ Test route (optional but helpful)
app.get("/", (req, res) => {
  res.send("SmartNotes API running 🚀");
});


// ✅ Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
