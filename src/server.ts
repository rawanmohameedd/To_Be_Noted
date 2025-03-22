import express from "express"
import cors from "cors"
import * as dotenv from "dotenv"; 
import connectDB from "./config/db";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { setupSwagger } from "./utils/swagger";

import taskRoutes from "./routes/tasks.routes";
import authRoutes from "./routes/auth.routes";
dotenv.config(); 

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

//setUp swagger
setupSwagger(app)

// Middleware
app.use(helmet()) // sets secures http headers
app.use(cors());
app.use(express.json());
app.use(rateLimit({windowMs: 15*60*1000, max: 100})) // 100 request for every 15 min.

//specify allowed origins
app.use(cors({
  origin: 'https://to-be-noted.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Routes
app.use("/auth", authRoutes);
app.use("/api", taskRoutes)


app.get('/', (req, res) => {
  res.send('Hello World');
});

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

  export default app;