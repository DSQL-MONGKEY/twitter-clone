import bcrypt from "bcryptjs";
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

export const getSuggestedUser = async(req, res) => {
   try {
      const userId = req.user._id;
      const userFollowedByMe = await User.findById(userId).select("following");

      const users = await User.aggregate([
         {
            $match: {
               _id: { $ne: userId },
            },
         },
         { $sample: { size: 10 } },
      ]);

      // Filter the suggested users that haven't followed
      const filteredUsers = users.filter(user => !userFollowedByMe.following.includes(user._id));
      const suggestedUsers = filteredUsers.slice(0, 4);

      suggestedUsers.forEach(user => (user.password = null));
      res.status(200).json(suggestedUsers);
   } catch(err) {
      console.log(`Error in getSuggestedUser ${err.message}`);
      res.status(500).json({ error: err.message });
   }
}

export const updateUser = async(req, res) => {
   const { fullName, username, email, currentPassword, newPassword, bio, link } = req.body;
   let { profileImg, coverImg } = req.body;

   const userId = req.user._id;

   try {
      const user = await User.findById(userId);
      if(!user) return res.status(400).json({ error: "User not found" });

      if((!newPassword && newPassword) || (!newPassword && currentPassword)) {
         return res.status(400).json({ error: 'Please provide both current password and new password' });
      }

      if(currentPassword && newPassword) {
         const isMatch = await bcrypt.compare(currentPassword, user.password);
         if(!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
         }
         if(newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
         }

         const salt = await bcrypt.genSalt(10);
         user.password = await bcrypt.hash(newPassword, salt);
      }
   } catch(err) {
      console.log(`Error in updateUser controller: ${err.message}`);
      res.status(500).json({ error: err.message });
   }

} 