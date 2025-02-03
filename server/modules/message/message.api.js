import express from "express";
import conversationModel from "../conversation/conversation.model.js";
import messageModel from "../message/message.model.js";
const messageRouter = express.Router();
//Get Messages:
messageRouter.get("/", (req, res, next) => {
  res.status(200).send({ message: "Welcome Message!" });
});
//Send Message:
messageRouter.post("/", async (req, res, next) => {
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
    const updateConversation = await conversation.updateOne(
      { _id: conversation._id },
      {
        lastMessage: {
          text: message,
          sender: senderId,
        },
      }
    );
    if (!updateConversation) {
      const error = new Error("Couldn't Update The Conversation!");
      res.status(500);
      return next(error);
    }
    if (!newMessage) {
      const error = new Error("Couldn't Create A New Message!");
      res.status(500);
      return next(error);
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
