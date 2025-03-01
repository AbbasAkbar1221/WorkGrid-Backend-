const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // Import cookie-parser
const authRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

// Initialize Express app
const app = express();

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Connected to the database");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};

// Middleware setup
const corsOptions = {
  origin: ['http://localhost:3000', 'https://work-grid-frontend.vercel.app','https://work-grid-frontend-atq2twdhq-abbas-akbars-projects.vercel.app/'], // Allowed origins
  credentials: true, // Allow credentials (cookies, etc.)
  methods: "GET, POST, PUT, DELETE, OPTIONS", // Allow all these methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Allow these headers
  optionsSuccessStatus: 200, // For legacy browsers that choke on 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));  // Handle preflight requests for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Use cookie-parser middleware

// Middleware for CORS
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Credentials", true);
//   next();
// });

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin || '*'); // Allow specific origin
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }
  next();
});

// Error handling middleware

//* Routes
app.use("/auth", authRoutes);
app.use("/task", taskRoutes);

app.use("/", (req, res) => {
  res.send("Hello World");
});

// Start server and connect to the database
const startServer = async () => {
  await connectDB();
  app.listen(3006, () => {
    console.log(`Server is running on port 3006`);
  });
};

startServer();

// app.use((req, res) => {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
