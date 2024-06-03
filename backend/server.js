import express from 'express';
import authRoutes from './routes/auth.routes';


const app = express();
const port = 3000;
const host = 'localhost'

app.use('/api/auth', authRoutes);

app.listen(port, () => {
   console.log(`Server is running on ${host}:${port}`)
})
