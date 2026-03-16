require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");

const connectDB = require("./config/db");

const app = express();

/* =========================
   DATABASE CONNECTION
========================= */
connectDB();

/* =========================
   TRUST PROXY
========================= */
app.set("trust proxy", 1);

/* =========================
   CORS
========================= */
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/* =========================
   BODY PARSER
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   COOKIE PARSER
========================= */
app.use(cookieParser());

/* =========================
   SECURITY (HELMET)
========================= */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

/* =========================
   LOGGER
========================= */
app.use(morgan("dev"));

/* =========================
   STATIC FILES (UPLOADS)
========================= */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
   API ROUTES
========================= */
app.use("/api", require("./routes"));

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running 🚀",
  });
});

/* =========================
   ERROR HANDLER
========================= */
app.use(require("./middleware/errorMiddleware"));

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});