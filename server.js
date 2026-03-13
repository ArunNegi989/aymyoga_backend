require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");

const connectDB = require("./config/db");

connectDB();

const app = express();

app.set("trust proxy", 1);

/* CORS */
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/* Body Parser */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Cookies */
app.use(cookieParser());

/* Security — crossOriginResourcePolicy disable kiya taaki images load ho sakein */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

/* Logger */
app.use(morgan("dev"));

/* Static Folder for Images */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* API Routes */
app.use("/api", require("./routes"));

/* Test Route */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

/* Error Middleware */
app.use(require("./middleware/errorMiddleware"));

/* Server */
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});