//IMPORTS:
import express from "express";
import { generateHash, compareHash } from "../../utils/encrypt.js";
import userModel from "./users.model.js";
import randomNumber from "../../utils/otpGenerate.js";
import generateToken from "../../utils/jwtToken.js";
import tokenCheck from "../../middleware/tokenCheck.js";
import generateQR from "../../utils/qrCode.js";
import mail from "../../utils/mailer.js";
import config from "../../config/cloudinaryConfig.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
//CONSTANTS:
const userRouter = express.Router();
config();
//Fetch Users:
userRouter.get("/", (req, res, next) => {
  res.status(200).send({ message: "Welcome To Application!" });
});
//Register:
userRouter.post("/register", async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;
    if (
      name.length === 0 ||
      username.length === 0 ||
      email.length === 0 ||
      password.length === 0
    ) {
      const error = new Error("The Fields Are Compulsory!");
      res.status(400); //BAD-REQUEST
      return next(error);
    }
    const userExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (userExists) {
      const error = new Error("Username or Email already exists!");
      res.status(409); // Conflict error
      return next(error);
    }
    const encryptedPw = await generateHash(password);
    if (!encryptedPw) {
      const error = new Error(
        "Internal Server Error! Failed To Encrypt Password!"
      );
      res.status(500); //Internal Server Error
      next(error);
    }
    const otp = randomNumber();
    if (!otp) {
      const error = new Error("Internal Server Error! OTP Creation Failed!");
      res.status(500); //INTERNAL ERROR
      next(error);
    }
    //Send The Mail With Otp!
    await mail("verify", email, otp);
    const newUser = await userModel.create({
      name,
      username,
      email,
      password: encryptedPw,
      otp,
    });
    if (!newUser) {
      const error = new Error("Internal Error! Invalid User Data!");
      res.status(500);
      next(error);
    }
    await newUser.save();
    res
      .status(201)
      .send({ message: "User Creation Successfull!", data: newUser });
  } catch (error) {
    res.status(500); //Internal Server Error
    error.message = "Internal Server Error!";
    next(error);
  }
});
//Login:
userRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (username.length === 0 || password.length === 0) {
      const error = new Error("The Fields Are Missing!");
      res.status(400); //Bad-Request
      return next(error);
    }
    const userExists = await userModel.findOne({ username });
    if (!userExists) {
      const error = new Error("The Username Is Not Found In DB!");
      res.status(401); //UnAuthorized
      return next(error);
    }
    //Check If The User Has Otp Validated:
    if (userExists.emailValidate === false) {
      const error = new Error("The Email Must Be Verified By Otp!");
      res.status(401);
      return next(error);
    }
    const comparePw = await compareHash(password, userExists.password);
    if (!comparePw) {
      const error = new Error("Password Entered Was Wrong!");
      res.status(400);
      return next(error);
    }
    //Unfreeze Account If Frozen!
    if (userExists.isFrozen === true) {
      const updatedFrozen = await userModel.findByIdAndUpdate(
        userExists._id,
        { isFrozen: false },
        { new: true }
      );
      if (!updatedFrozen) {
        const error = new Error("Failed to unfreeze the account!");
        res.status(500);
        return next(error);
      }
    }
    //Payload For JWT Token
    const payload = {
      _id: userExists._id,
      name: userExists.name,
      username: userExists.username,
      email: userExists.email,
      credit: userExists.credit,
    };
    const token = generateToken(req, res, next, payload);
    if (!token) {
      const error = new Error("Token Isn't Created!");
      res.status(500);
      return next(error);
    }
    res.status(202).send({ message: "You Are Welcome To The Platform!" });
  } catch (error) {
    error.message = "Internal Server Error!";
    res.status(500);
    next(error);
  }
});
//Logout:
userRouter.post("/logout", tokenCheck, (req, res, next) => {
  try {
    res.cookie("authToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 0,
    });

    res.status(200).send({ message: "Successfully Logged Out!" });
  } catch (error) {
    error.message = "Internal Error!";
    res.status(500);
    next(error);
  }
});
//Follow/Unfollow:
userRouter.post("/follow/:id", tokenCheck, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userToModify = await userModel.findById(id);
    const currentUser = await userModel.findById(req.userInfo._id);
    if (!userToModify || !currentUser) {
      const error = new Error("The User Wasn't Found!");
      res.status(400);
      return next(error);
    }
    if (req.userInfo._id === id) {
      const error = new Error("You Can't Follow/Unfollow Yourself!");
      res.status(400); //Bad-Request
      return next(error);
    }
    if (currentUser.following.includes(id)) {
      //Unfollow =>
      //Current User Removes The modifiedUser From Following List:
      await userModel.findByIdAndUpdate(req.userInfo._id, {
        $pull: { following: id }, //Remove Data When Condition Is Met!
      });
      //The ModifiedUser Removes The CurrentUser From Their Followers List
      await userModel.findByIdAndUpdate(id, {
        $pull: { followers: req.userInfo._id },
      });
      return res.status(200).send({ message: "Successfully Unfollowed!" });
    } else {
      //Follow =>
      //CurrentUser Adds The ModifiedUser In Their Following List:
      await userModel.findByIdAndUpdate(req.userInfo._id, {
        $push: { following: id },
      });
      //ModifiedUser Will Add The CurrentUser In Their Followers List:
      await userModel.findByIdAndUpdate(id, {
        $push: { followers: req.userInfo._id },
      });
      return res.status(200).send({ message: "Successfully Followed!" });
    }
  } catch (error) {
    error.message = "Internal Sever Error!";
    res.status(500);
    next(error);
  }
});
//Get Suggested Users:
userRouter.get("/suggested", tokenCheck, async (req, res, next) => {
  try {
    const ObjectId = mongoose.Types.ObjectId;
    const currentUserId = req.userInfo._id;
    const followedByYou = await userModel
      .findById(currentUserId)
      .select("following");
    if (!followedByYou) {
      const error = new Error("Unable To Find Followers!");
      res.status(404);
      return next(error);
    }
    const users = await userModel.aggregate([
      { $match: { _id: { $ne: new ObjectId(currentUserId) } } },
      { $sample: { size: 3 } },
    ]);
    if (!users || users.length === 0) {
      const error = new Error("No Suggestions Available!");
      res.status(404);
      return next(error);
    }
    const suggestedUsers = users.filter(
      (user) => !followedByYou.following.includes(user._id)
    );
    suggestedUsers.forEach((users) => (users.password = null));
    if (!suggestedUsers) {
      const error = new Error("Error Finding Suggestions!");
      res.status(500);
      return next(error);
    }
    res.status(200).send({ message: "Found Suggestions!", suggestedUsers });
  } catch (error) {
    error.message = "Internal Server Error!";
    res.status(500);
    next(error);
  }
});
//Freeze Account:
userRouter.put("/freeze", tokenCheck, async (req, res, next) => {
  try {
    const currentUserId = req.userInfo._id;
    const userExists = await userModel.findById(currentUserId);
    if (!userExists) {
      const error = new Error("Invalid User!");
      res.status(404);
      return next(error);
    }
    userExists.isFrozen = true;
    await userExists.save();
    res.status(200).send({ message: "Account Freezed Successfully!" });
  } catch (error) {
    error.message = "Internal Server Failed!";
    res.status(500);
    next(error);
  }
});
//Get Id Data:
userRouter.get("/userInfo/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      const error = new Error("User Id Missing!");
      res.status(400);
      return next(error);
    }
    const userExists = await userModel
      .findById(id)
      .select("username profilePic");
    if (!userExists) {
      const error = new Error("User Doesn't Exists!");
      res.status(404);
      return next(error);
    }
    res.status(200).send({ message: "User Found!", userExists });
  } catch (error) {
    error.message = "Internal Server Error!";
    res.status(500);
    next(error);
  }
});
//Get Profile:
userRouter.get("/profile/:username", async (req, res, next) => {
  try {
    const { username } = req.params;
    const userExists = await userModel
      .findOne({ username })
      .select("-password")
      .select("-updatedAt");
    if (!userExists) {
      const error = new Error("The User Doesn't Exist!");
      res.status(404); //Not-Found
      return next(error);
    }
    res.status(200).send({ message: "User Was Found!", userExists });
  } catch (error) {
    error.message = "Internal Server Failed!";
    res.status(500);
    next(error);
  }
});
//Update Profile:
userRouter.put("/update", tokenCheck, async (req, res, next) => {
  try {
    const { name, username, password, profilePic, bio, email } = req.body;
    const userId = req.userInfo._id;
    const userExists = await userModel.findById(userId);

    if (!userExists) {
      const error = new Error("User Doesn't Exist!");
      res.status(401); // Unauthorized
      return next(error);
    }
    if (name) userExists.name = name;
    if (bio) userExists.bio = bio;
    if (password) {
      const newPw = await generateHash(password);
      if (!newPw) {
        const error = new Error("Failed To Hash Password!");
        res.status(500);
        return next(error);
      }
      userExists.password = newPw;
    }
    if (profilePic && profilePic !== userExists.profilePic) {
      try {
        if (userExists.profilePic) {
          // Extract public ID from secure_url
          const urlParts = userExists.profilePic.split("/");
          const publicIdWithExtension = urlParts.slice(-1)[0];
          const publicId = publicIdWithExtension.split(".")[0];
          try {
            // Delete image from Cloudinary
            await cloudinary.uploader.destroy(publicId);
          } catch (error) {
            const err = new Error(
              "Failed to delete the previous profile picture!"
            );
            res.status(500);
            return next(err);
          }
        }
        const response = await cloudinary.uploader.upload(profilePic);
        if (!response) {
          const error = new Error("Image Upload Failed! Cloud Error!");
          res.status(500);
          return next(error);
        }
        userExists.profilePic = response.secure_url || userExists.profilePic;
      } catch (error) {
        error.message = "Image Upload Failed! Server Error!";
        res.status(500);
        return next(error);
      }
    }
    // Validate and update email
    if (email) {
      const emailCheck = (email) => {
        const emailRegex =
          /^(?!\.)[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(?<!\.)@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;
        return emailRegex.test(email);
      };
      const emailValid = emailCheck(email);
      if (!emailValid) {
        const error = new Error("The Email Is Invalid!");
        res.status(400); // Bad request
        return next(error);
      }
      userExists.email = email;
    }
    // Validate and update username
    if (username) {
      const regex = /^(?=.{3,20}$)(?!_)(?!.*__)[a-zA-Z0-9_]+(?<!_)$/;
      const validUsername = regex.test(username);
      if (!validUsername) {
        const error = new Error("Username Is Invalid!");
        res.status(400); // Bad request
        return next(error);
      }
      userExists.username = username;
    }
    await userExists.save();
    res
      .status(200)
      .send({ message: "Updated Successfully!", user: userExists });
  } catch (error) {
    error.message = "Internal Server Error!";
    res.status(500);
    return next(error);
  }
});
//OTP Check:
userRouter.post("/validateOtp", async (req, res, next) => {
  try {
    const { username, otp } = req.body;
    const idExists = await userModel.findOne({ username });
    if (!idExists) {
      const error = new Error(
        "The Username Used Is Invalid! Doesn't Exist In DB!"
      );
      res.status(400); //Bad-Request
      return next(error);
    }
    if (idExists.emailValidate == true) {
      return res.status(200).send({ message: "Email Already Validated!" });
    }
    if (parseInt(otp) !== idExists.otp) {
      const error = new Error("The OTP Entered Didn't Matched!");
      res.status(400); //Bad-Request
      return next(error);
    }
    const updateVerification = await userModel.findByIdAndUpdate(idExists._id, {
      emailValidate: true,
      otp: null,
    });
    await mail("verified", idExists.email);
    if (!updateVerification) {
      const error = new Error("Email Verification Failed");
      res.status(500);
      return next(error);
    }
    res.status(200).send({ message: "Successfully Validated!" });
  } catch (error) {
    error.message = "Internal Server Error!";
    res.status(500);
    next(error);
  }
});
//Get Cookies:
userRouter.get("/token", tokenCheck, async (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      const error = new Error("Token Is Missing!");
      res.status(403); //Forbidden
      return next(error);
    }
    const userData = req.userInfo;
    if (!userData) {
      const error = new Error("User Information Not Found!");
      res.status(404);
      return next(error);
    }
    const userInfo = await userModel
      .findById(userData._id)
      .select("name username profilePic email bio following followers credit");
    res.status(200).send({ message: "Token Found!", userInfo });
  } catch (error) {
    error.message = "Internal Server Error!";
    res.status(500);
    next(error);
  }
});
//QR CODE API:
userRouter.post("/qrCode", async (req, res, next) => {
  const { currentUrl, username, type } = req.body;
  if (type === "profile") {
    if (!username || username.length == 0) {
      const error = new Error("The Username Data Is Missing!");
      res.status(400);
      return next(error);
    }
    const userExists = await userModel.findOne({ username });
    if (!userExists) {
      const error = new Error("The Username Doesn't Exists!");
      res.status(401);
      return next(error);
    }
  }
  if (type === "post") {
    const { pid } = req.body;
    if (!username || username.length == 0 || !pid || pid.length == 0) {
      const error = new Error("The Username Or PID Data Is Missing!");
      res.status(400);
      return next(error);
    }
    //Check For Post Id:
  }
  const url = await generateQR(currentUrl);
  if (!url) {
    const error = new Error("Qr Generation Failed!");
    res.status(500);
    return next(error);
  }
  res.status(200).send({ url });
});
//EXPORTS:
export default userRouter;
