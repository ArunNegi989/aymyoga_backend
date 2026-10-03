require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.set("trust proxy", 1);

const allowedOrigins = [
  "https://www.indianyoga.aymyogaschool.com",
  "https://indianyoga.aymyogaschool.com",
  "http://localhost:3000", // dev
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api/upload", uploadRoutes);

const courseStatsRoute = require("./routes/courseStatsRoutes");
app.use("/api/course-stats", courseStatsRoute);

const contactRoute = require("./routes/Contact.route");
app.use("/api/contact", contactRoute);

app.use("/api", require("./routes"));

app.get("/", (req, res) => {
  res.json({ success: true, message: "API is running 🚀" });
});

app.use(require("./middleware/errorMiddleware"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
