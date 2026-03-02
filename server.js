require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

connectDB();

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: true,        // 🔥 IMPORTANT (dynamic origin allow)
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api", require("./routes"));

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.use(require("./middleware/errorMiddleware"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});