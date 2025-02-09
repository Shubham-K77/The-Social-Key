import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name Is Required For Registration!"],
    },
    username: {
      type: String,
      required: [true, "Username Is Required For Registration!"],
      match: [
        /^(?=.{3,20}$)(?!_)(?!.*__)[a-zA-Z0-9_]+(?<!_)$/,
        "Please Enter Valid Username To Be Used!",
      ],
      unique: [true, "Username Must Be Unique In The Platform!"],
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "Password Is Required For Registration!"],
      minLength: [8, "Password must be at least 8 characters long"],
    },
    profilePic: {
      type: String,
      default: "",
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    bio: {
      type: String,
      default: "",
      maxlength: [100, "Bio Can't Be Too Long!"],
    },
    email: {
      type: String,
      required: [true, "Email Is Required For Registration!"],
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Must Enter A Valid Email For Registration!",
      ],
      unique: [true, "Email Must Be Unique In The Platform!"],
    },
    emailValidate: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: Number,
    },
    credit: {
      type: Number,
      default: 15,
    },
    isFrozen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const userModel = mongoose.model("User", userSchema);
export default userModel;
