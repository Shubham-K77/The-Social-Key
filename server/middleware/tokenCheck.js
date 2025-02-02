//Imports:
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
//Constants:
const secret = process.env.jwtSecret;
const tokenCheck = async (req, res, next) => {
  const token = req.cookies.authToken; //Cookie-Parser
  if (!token) {
    const error = new Error("Token Is Missing!");
    res.status(401); //Unauthorized
    return next(error);
  }
  try {
    const validate = jwt.verify(token, secret);
    req.userInfo = validate;
    next();
  } catch (error) {
    res.status(403); //Forbidden
    error.message("Token Is Invalid Or Expired!");
    return next(error);
  }
};

export default tokenCheck;
