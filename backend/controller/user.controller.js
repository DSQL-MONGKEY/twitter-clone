import notifications from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getUserProfile = async(req, res) => {
   try {
      const { username } = req.params;

      const user = await User.findOne({ username }).select('-password');
      if(!user) return res.status(404).json({ error: 'User not found' });
      res.status(200).json(user);
   } catch(err) {
      console.log(`Error in getUserProfile ${err.message}`);
      res.status(500).json({ error: err.message });
   }
}

export const followUnfollowUser = async(req, res) => {
   try {
      const { id  } = req.params;
      const userToModify = await User.findById(id);
      const currentUser = await User.findById(req.user._id);

      if(id === req.user._id.toString()) {
         return res.status(400).json({ error: "You can't follow/unfollow yourself" })
      }
      

      if(!userToModify || !currentUser) {
         return res.status(400).json({ error: "User not found" });
      }

      const isFollowing = currentUser.following.includes(id)

      if(isFollowing) {
         // Unfollow the user
         await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } })
         await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } })
         // Send notification to the user
         const newNotifications = new notifications({
            type: "follow",
            from: req.user._id,
            to: userToModify,
         })

         res.status(200).json({ message: `Success unfollowed ${userToModify.username}` });
      } else {
         // Follow the user
         await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
         await User.findByIdAndUpdate(req.user._id, { $push: { following: id } })
         // Send notificaion to the user
         const newNotifications = new notifications({
            type: "follow",
            from: req.user._id,
            to: userToModify,
         })
         await newNotifications.save();
         res.status(200).json({ message: `Success followed ${userToModify.username}` });
      }
   } catch(err) {
      console.log(`Error in followUnfollowUser: ${err.message}`);
      res.status(500).json({ error: err.message });
   }
}