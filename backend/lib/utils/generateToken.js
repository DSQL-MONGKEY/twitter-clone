import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = async(userId, res) => {
   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '15d'
   });
   res.cookie('jwt', token, {
      maxAge: 15 * 24 * 60 * 1000, // milisecond
      httpOnly: true, // prevent XSS attacks (cross-site scripting) 
      sameSite: 'strict', // CSRF attack (cross-site request forgery  )
      secure: process.env.NODE_ENV !== 'development'
   })
}