import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import connectMongoDB from './db/connectMongodb.js';
import cookieParser from 'cookie-parser';

dotenv.config()

const app = express();
const HOST = process.env.HOST;
const PORT = process.env.PORT;

app.use(express.json()); // to parse request.body
app.use(express.urlencoded({ extended: true })) // to parse form data
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
   console.log(`Server is running on ${HOST}:${PORT}`);
   connectMongoDB();
})
