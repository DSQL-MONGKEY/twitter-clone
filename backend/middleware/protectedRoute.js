import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


const protectedRoute = async(req, res, next) => {
   try {
      const token = req.cookies.jwt;
      if(!token) {
         res.status(401).json({ error: 'Unauthorized: No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if(!decoded) {
         res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }

      const user = await User.findById(decoded.userId).select('-password');
      if(!user) {
         res.status(404).json({ error: 'User not found' })
      }

      req.user = user;
      next();
   } catch(err) {
      console.log(`Error in protectRoute middleware ${err.message}`);
      res.status(500).json({ error: 'Internal server error' });
   }
}

export default protectedRoute;