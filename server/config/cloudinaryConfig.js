//Imports:
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
//Constants:
dotenv.config();
const cloudName = process.env.cloudinaryCloudName;
const cloudApiKey = process.env.cloudinaryApiKey;
const cloudApiSecret = process.env.cloudinaryApiSecret;
//Configuration:
const config = () => {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: cloudApiKey,
    api_secret: cloudApiSecret,
  });
};
//Export:
export default config;
