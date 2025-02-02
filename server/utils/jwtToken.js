import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secret = process.env.jwtSecret;
const generateToken = (req, res, next, payload) => {
  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  if (!token) {
    const error = new Error("Unable To Create The Token!");
    res.status(500); //Internal Server Error
    return next(error);
  }
  res.cookie("authToken", token, {
    httpOnly: true,
    secure: false,
    maxAge: 3600000,
    sameSite: "strict", //CSRF
  });
  return token;
};

export default generateToken;
