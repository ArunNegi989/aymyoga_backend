const jwt = require("jsonwebtoken");

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "60d",
  });
};

const sendTokenResponse = async (user, statusCode, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

 const cookieOptions = {
  httpOnly: true,
  secure: false,      // since you're using HTTP
  sameSite: "lax",    // 🔥 CHANGE FROM STRICT TO LAX
  maxAge: 60 * 24 * 60 * 60 * 1000,
};

  res.cookie("refreshToken", refreshToken, cookieOptions);

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  res.status(statusCode).json({
    success: true,
    accessToken,
    expiresIn: "7d",
    user: userObj,
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  sendTokenResponse,
};