//Imports:
import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import userModel from "../users/users.model.js";
import postModel from "./posts.model.js";
import tokenCheck from "../../middleware/tokenCheck.js";
import config from "../../config/cloudinaryConfig.js";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();
config();
//Router:
const postRouter = express.Router();
const apiUrl = process.env.ttsApiUrl;
const ttiApiUrl = process.env.ttiApiUrl;
const apiKey = process.env.huggingFaceKey;
//TTS-Routing:
postRouter.post("/tts", tokenCheck, async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      const err = new Error("The Prompt Is Missing!");
      res.status(400);
      return next(err);
    }
    const currentUser = await userModel.findById({ _id: req.userInfo._id });
    if (currentUser.credit > 0) {
      const response = await axios.post(
        apiUrl,
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        }
      );
      if (!response || response.status !== 200) {
        const error = new Error("Model Connection Failed!");
        res.status(500);
        return next(error);
      }
      res.setHeader("Content-Type", "audio/mpeg");
      const updateCredit = await userModel.findByIdAndUpdate(
        { _id: currentUser._id },
        { credit: currentUser.credit - 1 }
      );
      if (!updateCredit) {
        const error = new Error("The Credit Wasn't Updated!");
        res.status(400);
        return next(error);
      }
      res.status(200).send({
        message: "Audio File Generated!",
        data: response.data,
        credit: updateCredit.credit,
      });
    } else {
      const err = new Error("The Free Credits Are Over!");
      res.status(401);
      return next(err);
    }
  } catch (error) {
    console.error("Error generating TTS:", error.message);
    const err = new Error("Internal Server Error! Communication Failed!");
    res.status(500);
    next(err);
  }
});
//Create AI Image:
postRouter.post("/tti", tokenCheck, async (req, res, next) => {
  try {
    const { prompt } = req.body;
    const currentUser = await userModel.findById({ _id: req.userInfo._id });
    if (currentUser.credit > 0) {
      const response = await axios.post(
        ttiApiUrl,
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "content-type": "application/json",
          },
          responseType: "arraybuffer",
        }
      );
      if (!response || response.status != 200) {
        const error = new Error("AI Model Didn't Respond!");
        res.status(500);
        return next(error);
      }
      const updateCredit = await userModel.findByIdAndUpdate(
        { _id: currentUser._id },
        { credit: currentUser.credit - 1 }
      );
      if (!updateCredit) {
        const error = new Error("The Credit Wasn't Updated!");
        res.status(400);
        return next(error);
      }
      res.status(200).send({
        message: "Image Generated!",
        data: response.data,
        credit: updateCredit.credit,
      });
    } else {
      const err = new Error("The Free Credits Are Over!");
      res.status(500);
      next(err);
    }
  } catch (error) {
    console.error("Error generating TTS:", error.message);
    res.status(500);
    return error;
  }
});
// Create Post Routing [User Post Creation]:
postRouter.post("/create", tokenCheck, async (req, res, next) => {
  try {
    const { postedBy, text, postType } = req.body;
    let { img } = req.body;
    if (!postedBy || !text) {
      const error = new Error("Please Fill Out The Informations!");
      res.status(400); //Bad Request
      return next(error);
    }
    const userExists = await userModel.findById(postedBy);
    if (!userExists) {
      const error = new Error("The User Wasn't Found!");
      res.status(401); //Unauthorized
      return next(error);
    }
    if (img) {
      const response = await cloudinary.uploader.upload(img);
      if (!response) {
        const error = new Error("Image Upload Failed! Cloud Error!");
        res.status(500);
        return next(error);
      }
      img = response.secure_url;
    }
    const newPost = {
      postedBy,
      text,
      img,
      postType,
    };
    const createPost = await postModel.create(newPost);
    if (!createPost) {
      const error = new Error("Post Creation Failed!");
      res.status(500);
      return next(error);
    }
    res.status(200).send({
      message: "Successfully Created!",
      createPost,
    });
  } catch (error) {
    error.message = "Internal Server Failed!";
    res.status(500);
    next(error);
  }
});
//Get The Feed:
postRouter.get("/feed", tokenCheck, async (req, res, next) => {
  try {
    const loginId = req.userInfo._id;
    const userInfo = await userModel.findById(loginId);
    if (!userInfo) {
      const error = new Error("The User Info Not Found!");
      res.status(401);
      return next(error);
    }
    const following = userInfo.following;
    const feedPost = await postModel
      .find({ postedBy: { $in: following } })
      .sort({ createdAt: -1 })
      .populate("postedBy", "username profilePic");
    if (!feedPost) {
      const error = new Error("Internal Error!");
      res.status(500);
      return next(error);
    }
    res.status(200).send({ message: "Posts Found!", feedPost });
  } catch (error) {
    error.message = "Internal Error!";
    res.status(500);
    next(error);
  }
});
//getPost Routing:
postRouter.get("/:id", async (req, res, next) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      const error = new Error("Post Id Missing!");
      res.status(400);
      return next(error);
    }
    const postInfo = await postModel
      .findById(postId)
      .populate("postedBy", "username profilePic");
    if (!postInfo) {
      const error = new Error("Post ID Is Invalid!");
      res.status(404);
      return next(error);
    }
    res.status(200).send({
      message: "post Retrieved!",
      postInfo,
    });
  } catch (error) {
    error.message = "Internal Server Error!";
    res.status(500);
    next(error);
  }
});
//Delete The Post:
postRouter.delete("/:id", tokenCheck, async (req, res, next) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      const error = new Error("PostId Is Missing!");
      res.status(400); // Changed to 400 for bad request
      return next(error);
    }
    const postInfo = await postModel.findById(postId);
    if (!postInfo) {
      const error = new Error("The Post Wasn't Found In The DataBase!");
      res.status(404); // This is fine for post not found
      return next(error);
    }
    if (req.userInfo._id.toString() !== postInfo.postedBy.toString()) {
      const error = new Error("User Not Authorized!");
      res.status(401); // Unauthorized if user doesn't own post
      return next(error);
    }
    const imgUrl = postInfo.img;
    if (imgUrl) {
      const publicId = imgUrl.split("/").pop().split(".")[0];
      // Log Cloudinary result for debugging purposes
      const destroy = await cloudinary.uploader.destroy(publicId);
      if (!destroy || destroy.result !== "ok") {
        // Check for success result
        const error = new Error("Cloudinary Unable To Delete Image!");
        res.status(500);
        return next(error);
      }
    }
    // Delete post from database
    const query = await postModel.findByIdAndDelete(postInfo._id);
    if (!query) {
      const error = new Error("Unable to Delete Post from Database!");
      res.status(500);
      return next(error);
    }
    res.status(200).send({
      message: "The Post Was Deleted Successfully!",
      query,
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    error.message = error.message || "Internal Server Error!";
    res.status(500);
    next(error);
  }
});

//Like or Unlike The Post
postRouter.put("/like/:id", tokenCheck, async (req, res, next) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      const error = new Error("The postId Is Missing In The Url!");
      res.status(400);
      return next(error);
    }
    const postInfo = await postModel.findById(postId);
    if (!postInfo) {
      const error = new Error("The Post Wasn't Found!");
      res.status(404);
      return next(error);
    }
    const userId = req.userInfo._id;
    if (postInfo.postedBy.toString() === userId) {
      const error = new Error("You Can't Like Your Own Post!");
      res.status(400);
      return next(error);
    }
    if (postInfo.likes.includes(userId)) {
      //User Should Unlike
      await postModel.findByIdAndUpdate(postId, { $pull: { likes: userId } });
      return res.status(200).send({
        message: "Successfully Unliked The Post!",
      });
    } else {
      //User Should Like
      await postModel.findByIdAndUpdate(postId, { $push: { likes: userId } });
      return res.status(200).send({
        message: "Successfully Liked The Post!",
      });
    }
  } catch (error) {
    error.message = "Internal Server Error!";
    res.status(500);
    next(error);
  }
});
//Reply The Post
postRouter.put("/reply/:id", tokenCheck, async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      const error = new Error("The Reply Can't Be Empty!");
      res.status(400);
      return next(error);
    }
    const userId = req.userInfo._id;
    if (!userId) {
      const error = new Error("Must Login To Continue!");
      res.status(401);
      return next(error);
    }
    const postId = req.params.id;
    if (!postId) {
      const error = new Error("The Post Id Wasn't Found!");
      res.status(400);
      return next(error);
    }
    const postInfo = await postModel.findById(postId);
    if (!postInfo) {
      const error = new Error("Post Not Found!");
      res.status(404);
      return next(error);
    }
    const userInfo = await userModel.findById(userId);
    if (!userInfo) {
      const error = new Error("User Not Found!");
      res.status(404);
      return next(error);
    }
    const userProfilePic = userInfo.profilePic;
    const username = userInfo.username;
    const newReply = { userId, text, userProfilePic, username };
    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      {
        $push: { replies: newReply },
      },
      { new: true }
    );
    if (!updatedPost) {
      const error = new Error("Reply Failed! Internal Error!");
      res.status(500);
      return next(error);
    }
    res.status(200).send({
      message: "Successfully Replied!",
      updatedPost,
    });
  } catch (error) {
    error.message = "Internal Server Error!";
    res.status(500);
    next(error);
  }
});
//Get The Post Of The User:
postRouter.get("/user/:username", async (req, res, next) => {
  try {
    const username = req.params.username;
    const findUser = await userModel.findOne({ username });
    if (!findUser) {
      const error = new Error("Username Doesn't Exist!");
      res.status(400);
      return next(error);
    }
    const postInfo = await postModel
      .find({ postedBy: findUser._id })
      .sort({ createdAt: -1 });
    if (!postInfo) {
      const error = new Error("Posts Extraction Failed! Try Again!");
      res.status(500);
      return next(error);
    }
    res.status(200).send({ message: "User Post Fetched!", postInfo });
  } catch (error) {
    error.message = "Unable To Fetch Posts!";
    res.status(500);
    next(error);
  }
});

// Export Router:
export default postRouter;
