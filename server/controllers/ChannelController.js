import express from 'express';
import Channel from '../models/Channel.js';
import User from '../models/User.js';
import Message from '../models/Message.js';

const router = express.Router();

// Create a new channel
export const createChannel = async (req, res) => {

    try {
        const { name, members } = req.body;
        const userId = req.user._id;

        const admin = await User.findById(userId);
        
        if (!admin) {
            return res.status(404).json({ error: 'Admin user not found.' });
        }
        const validMembers = await User.find({ _id: { $in: members } });
        if (validMembers.length !== members.length) {
            return res.status(400).json({ error: 'One or more members not found.' });
        }

        if (!name || !members || members.length === 0) {
            return res.status(400).json({ error: 'Name and members are required.' });
        }

        const channel = new Channel({
            name,
            members: [...members, userId],
            admin:userId,
        });

        await channel.save();
        res.status(201).json(channel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getUserChannels = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required.' });
        }

        const channels = await Channel.find({ members: userId })
            .populate('members', '-password')
            .populate('admin', '-password')
            .sort({ updatedAt: -1 });

        if (!channels || channels.length === 0) {


            return res.status(404).json({ error: 'No channels found for this user.' });
        }
        res.status(200).json(channels);
            

            
    }
    catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// export const sendChannelMessage = async (req, res) => {
//     try {
//         const { channelId, content } = req.body;
//         const userId = req.user._id;

//         if (!channelId || !content) {
//             return res.status(400).json({ error: 'Channel ID and content are required.' });
//         }
//         if (!userId) {
//             return res.status(400).json({ error: 'User ID is required.' });
//         }
//         const message = new Message({
//             sender: userId,
//             messageType: "text",
//             content
//         });
//         await message.save();



//         const channel = await Channel.findOneAndUpdate(
//           { _id: channelId }, // ✅ query object
            
//             { $push: { messages: message._id } },
//             { new: true }
//         );
//         res.status(201).json(channel);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }

export const sendChannelMessage = async (req, res) => {
    try {
        const { channelId, content } = req.body;
        const userId = req.user._id;

        if (!channelId || !content) {
            return res.status(400).json({ error: 'Channel ID and content are required.' });
        }
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required.' });
        }
        const message = new Message({
            sender: userId,
            messageType: "text",
            content
        });
        await message.save();



        const channel = await Channel.findOneAndUpdate(
          { _id: channelId }, 
            
            { $push: { messages: message._id } },
            { new: true }
        );
        res.status(201).json(channel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
export const getChannelMessage = async (req, res) => {
    try {
        const { channelId } = req.body;
        const userId = req.user._id;

        if (!channelId ) {
            return res.status(400).json({ error: 'Channel ID  are required.' });
        }
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required.' });
        }
        



        const channel = await Channel.findById(
          channelId
           
        );

        if (!channel) {
            return res.status(404).json({ error: 'Channel not found.' });
        }

        const messages = await Message.find({ _id: { $in: channel.messages } })
            .populate('sender', '-password')
            .sort({ timestamp: 1 });


        res.status(201).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}