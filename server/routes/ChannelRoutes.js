import express from 'express';
import Channel from '../models/Channel.js';
import { createChannel, getChannelMessage, getUserChannels, sendChannelMessage } from '../controllers/ChannelController.js';
import { protect } from '../middlewares/AuthMiddleware.js';


const router = express.Router();

router.post('/create-channel', protect ,createChannel);
// Get a channel by ID
router.get('/get-channel', protect, getUserChannels);
router.post('/send-message', protect, sendChannelMessage);
router.post('/get-messages', protect, getChannelMessage)







export default router;
