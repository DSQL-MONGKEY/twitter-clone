import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
   fullName: {
      type: String,
      required: true,
   },
   username: {
      type: String,
      required: true,
      unique: true,
   },
   password: {
      type: String,
      required: true,
      minLength: 6,
   },
   email: {
      type: String,
      required: true,
      unique: true,
   },
   followers: [
      {
         type: mongoose.Schema.ObjectId, // reference to user model
         ref: "user",
         default: [],
      }
   ],
   following: [
      {
         type: mongoose.Schema.ObjectId,
         ref: "user",
         default: [],
      }
   ],
   profileImg: {
      type: String,
      default: "",
   },
   coverImg: {
      type: String,
      default: ""
   },
   bio: {
      type: String,
      default: ""
   },
   link: {
      type: String,
      default: ""
   }
}, { timestamps: true })

const User = mongoose.model("user", userSchema);

export default User;