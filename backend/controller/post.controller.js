import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import notifications from "../models/notification.model.js";



export const createPost = async(req, res) => {
   try {
      const { text } = req.body;
      let { img } = req.body;
      const userId = req.user._id.toString();

      const user = await User.findById(userId);
      if(!user) return res.status(404).json({ error: 'User not found' });

      if(!user && !img) {
         return res.status(400).json({ error: 'Post must have text or image' })
      }

      if(img) {
         const uploadedResponse = await cloudinary.uploader.upload(img);
         img = uploadedResponse.secure_url;
      }

      const newPost = new Post({
         user: userId,
         text,
         img
      })
      await newPost.save();

      res.status(201).json(newPost);
   } catch(err) {
      res.status(500).json({ error: 'Internal server error' })
      console.log(`Error in createPost controller: ${err}`)
   }
}

export const deletePost = async(req, res) => {
   try {
      const post = await Post.findById(req.params.id);
      if(!post) {
         return res.status(404).json({ error: 'Post not found' });
      }

      if(post.user.toString() !== req.user._id.toString()) {
         return res.status(401).json({ error: 'You are not authorized to delete this post' })
      }

      if(post.img) {
         const imgId = post.img.split('/').pop().split('.')[0];
         await cloudinary.uploader.destroy(imgId);
      }

      await Post.findByIdAndDelete(req.params.id);

      res.status(200).json({ error: 'Post deleted successfully' });
   } catch(err) {
      res.status(500).json({ error: 'Internal server error' });
      console.log(`Error in deletePost Controller: ${err}`);
   }
}

export const commentOnPost = async(req, res) => {
   try {
      const { text } = req.body;
      const postId = req.params.id;
      const userId = req.user._id;

      if(!text) {
         return res.status(401).json({ error: 'Text field is required' });
      }

      const post = await Post.findById(postId);

      if(!postId) { 
         return res.status(404).json({ error: 'Post not found' });
      }

      const comment = { user: userId, text }
      post.comments.push(comment);
      await post.save();

      res.status(201).json(post);
   } catch(err) {
      res.status(500).json({ error: 'Internal server error' });
      console.log(`Error in commentOnPost controller: ${err}`);
   }
}

export const likeUnlikePost = async(req, res) => {
   try {
      const userId = req.user._id;
      const postId = req.params.id; // {id:postId} = req.params
      console.log(postId)

      // Check the post
      const post = await Post.findById(postId);
      if(!post) {
         return res.status(404).json({ error: 'Post not found' });
      }

      const userLikedPost = post.likes.includes(userId);

      if(userLikedPost) {
         // Unlike User Post
         await Post.updateOne({_id: postId}, {$pull: {likes: userId} });
         await User.updateOne({_id: userId}, {$pull: {likedPosts: postId} });
         
         const updatedLikes = post.likes.filter(id => (
            id.toString() !== userId.toString()
         ));
         res.status(200).json(updatedLikes);
      } else {
         // Like  User Post
         post.likes.push(userId);
         await User.updateOne({_id: userId}, {$push: {likedPosts: postId}});
         await post.save();

         const notification = new notifications({
            from: userId,
            to: post.user,
            type: 'like'
         })
         await notification.save();
         
         const updatedLikes = post.likes;
         res.status(201).json(updatedLikes);
      }
   } catch(err) {
      res.status(500).json({ error: 'Internal server error' });
      console.log(`Error in likeUnlikePost controller: ${err}`);
   }
}

