// Import mongoose module:
import mongoose from "mongoose";
import * as dotenv from "dotenv"; 
dotenv.config(); 

// Requiring process to use the exit method
const process = require("process");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.log("MongiDB connection error: ", (error as Error).message);

    // To exit the current process with failure.
    process.exit(1);
  }
};

export default connectDB;