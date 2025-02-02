//IMPORTS:
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
//CONSTANTS:
const min = parseInt(process.env.cryptoMin);
const max = parseInt(process.env.cryptoMax);
const randomNumber = () => {
  try {
    const otp = crypto.randomInt(min, max);
    return otp;
  } catch (error) {
    error.message = "Unable To Generate Otp!";
    console.error(error);
  }
};
export default randomNumber;
