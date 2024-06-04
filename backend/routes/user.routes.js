import express from 'express';
import { followUnfollowUser, getUserProfile } from '../controller/user.controller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/profile/:username', protectRoute, getUserProfile);
// router.get('/suggested', , getUserProfile);
router.post('/follow/:id', protectRoute, followUnfollowUser);
// router.post('/update', updateUserProfile);


export default router;