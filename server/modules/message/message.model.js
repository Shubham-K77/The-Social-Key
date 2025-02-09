import mongoose from "mongoose";
const messageSchema = mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: [true, "Conversation Id Is Required For More Info!"],
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender Id Must Be Specified!"],
    },
    text: {
      type: String,
      required: [true, "Text For Message Is Required!"],
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const messageModel = mongoose.model("Message", messageSchema);
export default messageModel;
