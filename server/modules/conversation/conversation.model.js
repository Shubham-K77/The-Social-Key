import mongoose from "mongoose";
const conversationSchema = mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Participants Must Be Specified!"],
      },
    ],
    lastMessage: {
      text: String,
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "The Sender Must Be Specified!"],
      },
    },
  },
  { timestamps: true }
);
const conversationModel = mongoose.model("Conversation", conversationSchema);
export default conversationModel;
