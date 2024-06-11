import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
   },
   text: {
      type: String,
   },
   img: {
      type: String,
   },
   likes: [
      {
         type: mongoose.Schema.ObjectId,
         ref: 'User',
         required: true,
      }
   ],
   comments: [
      {
         user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
         },
         text: {
            type: String,
            required: true,
         }
      }
   ],
}, { timestamps: true })

const Post = mongoose.model("post", postSchema);
export default Post;