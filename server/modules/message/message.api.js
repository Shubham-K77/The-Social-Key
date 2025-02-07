import express from "express";
import conversationModel from "../conversation/conversation.model.js";
import messageModel from "../message/message.model.js";
import tokenCheck from "../../middleware/tokenCheck.js";
import { getRecipientSocketId } from "../../sockets/socket.js";
const messageRouter = express.Router();
//Get Your Messages:
messageRouter.get("/conversations", tokenCheck, async (req, res, next) => {
  try {
    const currentUser = req.userInfo;
    const conversation = await conversationModel
      .find({
        participants: currentUser._id,
      })
      .sort({ createdAt: 1 })
      .populate({
        path: "participants",
        select: "username profilePic",
      });
    if (!conversation) {
      const error = new Error("Conversation For The User Not Found!");
      res.status(404);
      return next(error);
    }
    //Send The Data For Other Users Only!
    conversation.forEach((conversation) => {
      conversation.participants = conversation.participants.filter(
        (participant) =>
          participant._id.toString() !== currentUser._id.toString()
      );
    });
    res.status(200).send({ conversation });
  } catch (error) {
    error.message = "Internal Server Error!";
    res.status(500);
    next(error);
  }
});
//Get Messages With Other People:
messageRouter.get("/:otherUserId", tokenCheck, async (req, res, next) => {
  try {
    const { otherUserId } = req.params;
    const currentUserId = req.userInfo._id;
    //If User Is Trying To Find Conversation To Himself:
    if (otherUserId === currentUserId) {
      const error = new Error("You Can't See Messages With Yourself!");
      res.status(404);
      return next(error);
    }
    //Find Conversation:
    const conversation = await conversationModel.findOne({
      participants: { $all: [currentUserId, otherUserId] },
    });
    if (!conversation) {
      const error = new Error("No Record Of Conversation Found!");
      res.status(404);
      return next(error);
    }
    const messages = await messageModel
      .find({
        conversationId: conversation._id,
      })
      .sort({ createdAt: 1 });
    if (!messages) {
      const error = new Error("No Record Of Messages Found!");
      res.status(404);
      return next(error);
    }
    res.status(200).send({ messages });
  } catch (error) {
    error.message = "Internal Server Error!";
    res.status(500);
    next(error);
  }
});
//Send Message:
messageRouter.post("/", tokenCheck, async (req, res, next) => {
  try {
    const { recepientId, message } = req.body;
    const senderId = req.userInfo._id;
    //Finding Conversation:
    let conversation = await conversationModel.findOne({
      participants: {
        $all: [senderId, recepientId],
      },
    });
    //New Conversation:
    if (!conversation) {
      conversation = await conversationModel.create({
        participants: [senderId, recepientId],
        lastMessage: {
          text: message,
          sender: senderId,
        },
      });
    }
    //Create New Message:
    const newMessage = await messageModel.create({
      conversationId: conversation._id,
      senderId,
      text: message,
    });
    //Update The Conversation:
    const updatedConversation = await conversationModel.findOneAndUpdate(
      { _id: conversation._id },
      {
        lastMessage: {
          text: message,
          sender: senderId,
        },
      },
      { new: true }
    );
    if (!updatedConversation) {
      const error = new Error("Couldn't Update The Conversation!");
      res.status(500);
      return next(error);
    }
    if (!newMessage) {
      const error = new Error("Couldn't Create A New Message!");
      res.status(500);
      return next(error);
    }
    //Send The Message Immediately To Socket Server No Need To Fetch!
    const recieverSocketId = getRecipientSocketId(recepientId);
    if (recieverSocketId) {
      io.to(recieverSocketId).emit("newMessage", newMessage);
    }
    //Successfully Updated!
    res.status(200).send({ message: "New Message Created!", newMessage });
  } catch (error) {
    error.message = "Internal Server Error!";
    res.status(500);
    next(error);
  }
});
export default messageRouter;
