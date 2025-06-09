import express, { urlencoded } from 'express';
import cors from 'cors';
// import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose, { set } from 'mongoose';
import authRoutes from './routes/AuthRoutes.js';
import MessageRoutes from './routes/MessageRoutes.js';
import ChannelRoutes from './routes/ChannelRoutes.js';
import setUpSocket from './socket.js';

import path from 'path';


// dotenv.config
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(cors({
    origin: process.env.ORIGIN,
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));


const PORT = process.env.PORT || 5000;
const databaseURL= process.env.DATABASE_URL;

app.use('/api/auth', authRoutes);
app.use('/api/msg', MessageRoutes);
app.use('/api/channel', ChannelRoutes);


app.get('/', (req, res) => {
    res.send('Welcome to the server');
});

const server=app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
setUpSocket(server);

mongoose
.connect(databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => { console.log('Connected to MongoDB');})
.catch((error) => {console.error('Error connecting to MongoDB:', error);}); 