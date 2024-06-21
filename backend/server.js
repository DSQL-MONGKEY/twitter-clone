import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';

import connectMongoDB from './db/connectMongodb.js';

dotenv.config()

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_SECRET_KEY,
})

const app = express();
const HOST = process.env.HOST;
const PORT = process.env.PORT;

app.use(express.json()); // to parse request.body
app.use(express.urlencoded({ extended: true })) // to parse form data
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes)

app.listen(PORT, () => {
   console.log(`Server is running on ${HOST}:${PORT}`);
   connectMongoDB();
})
