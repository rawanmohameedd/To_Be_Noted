import express from "express"
import cors from "cors"
import * as dotenv from "dotenv"; 
import connectDB from "./config/db";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { setupSwagger } from "./utils/swagger";
import path from "path";

import taskRoutes from "./routes/tasks.routes";
import authRoutes from "./routes/auth.routes";
dotenv.config(); 

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

//setUp swagger

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

// Serve Swagger UI assets
app.use('/swagger-ui', express.static(path.join(__dirname, '../node_modules/swagger-ui-dist')));

setupSwagger(app)
// Routes
app.use("/auth", authRoutes);
app.use("/api", taskRoutes)


app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/debug-swagger-ui-bundle', (req, res) => {
  res.send('This should be the swagger-ui-bundle.js file');
});

app.get('/debug-headers', (req, res) => {
  res.json({
    headers: req.headers,
    path: req.path,
    baseUrl: req.baseUrl,
    originalUrl: req.originalUrl
  });
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