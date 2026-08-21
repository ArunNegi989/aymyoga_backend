require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

/* ========================= DATABASE ========================= */
connectDB();

app.set("trust proxy", 1);

/* ========================= CORS — must be first ========================= */
const allowedOrigins = [
  "https://www.indianyoga.aymyogaschool.com",
  "https://indianyoga.aymyogaschool.com",
  "http://localhost:3000", // dev
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like curl, Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* ========================= BODY PARSER ========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ========================= COOKIE PARSER — before routes ========================= */
app.use(cookieParser()); // ✅ must be here before ANY route

/* ========================= SECURITY ========================= */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

/* ========================= LOGGER ========================= */
app.use(morgan("dev"));

/* ========================= STATIC FILES ========================= */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ========================= ROUTES — all after middleware ========================= */
const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api/upload", uploadRoutes);

const courseStatsRoute = require("./routes/courseStatsRoutes");
app.use("/api/course-stats", courseStatsRoute); // ✅ moved after cookieParser

const contactRoute = require("./routes/Contact.route");
app.use("/api/contact", contactRoute);

app.use("/api", require("./routes")); // ✅ this includes /api/auth/refresh

/* ========================= HEALTH CHECK ========================= */
app.get("/", (req, res) => {
  res.json({ success: true, message: "API is running 🚀" });
});

/* ========================= ERROR HANDLER ========================= */
app.use(require("./middleware/errorMiddleware"));

/* ========================= SERVER START ========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});