import express from "express"
import cors from "cors"
import * as dotenv from "dotenv"; 
import connectDB from "./config/db";

import taskRoutes from "./routes/tasks.routes";
import authRoutes from "./routes/auth.routes";
dotenv.config(); 

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/api", taskRoutes)
// Connect to database
connectDB()
  .then(() => {
    // Start server after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });