//IMPORTS
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
//CONSTANTS
dotenv.config();
const round = parseInt(process.env.ROUND) || 10;
//GENERATE HASHED PASSWORD
const generateHash = async (password) => {
  try {
    const salt = await bcrypt.genSalt(round);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    error.message = "Error Generating Hashed Password!";
    console.error(error);
  }
};
//COMPARE THE PASSWORDS
const compareHash = async (password, hashedPass) => {
  try {
    const comparePW = await bcrypt.compare(password, hashedPass);
    return comparePW;
  } catch (error) {
    error.message = "Error Comparing Passwords!";
    console.error(error);
  }
};
export { generateHash, compareHash };
