import mongoose from "mongoose";
const postSchema = mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "The Creator Must Be On The Platform!"],
    },
    text: {
      type: String,
      maxlength: [5000, "The Text/Status Can't Be Too Long!"],
    },
    img: {
      type: String,
      default: "",
    },
    likes: {
      //Array Of Users That Likes The Post:
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    postType: {
      type: String,
      default: "Human",
    },
    replies: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: [true, "Username Must Be Specified!"],
        },
        text: {
          type: String,
          required: true,
        },
        userProfilePic: {
          type: String,
        },
        username: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const postModel = mongoose.model("Post", postSchema);
export default postModel;
