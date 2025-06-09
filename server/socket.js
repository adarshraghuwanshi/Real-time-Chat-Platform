import { Server as SocketIOServer } from 'socket.io';
import Message from './models/Message.js';
import Channel from './models/Channel.js';
import dotenv from 'dotenv';
dotenv.config();


const setUpSocket= (server) => { 
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            credentials: true,
        },
    });
    const userSocketMap = new Map();
    const disconnect = (socket) => {
       
        console.log('A user disconnected:', socket.id);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                // console.log(`User ${userId} disconnected`);
                break;
            }
        }
    };
    const sendMessage = async(message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);
        

        const createdMessage = await Message.create(message);
        if(!createdMessage) {
            console.error('Failed to create message:', message);
            return;
        }

        const messageData= await Message.findById(createdMessage._id)
        // .populate('sender', 'id email firstName lastName')
        // .populate('recipient', 'id email firstName lastName ');
        const plainMessage = messageData.toObject();

        console.log('Message sent:', plainMessage);

        if(recipientSocketId ){
            io.to(recipientSocketId).emit('receiveMessage', plainMessage);
        }
        if(senderSocketId ){
            io.to(senderSocketId).emit('receiveMessage', messageData);
        }
       
    };
    const sendChannelMessage = async (message) => {

        const senderSocketId = userSocketMap.get(message.sender);
        const channelId = message.channelId;

        if (!channelId) {
            console.error('Channel ID is required to send a channel message');
            return;
        }
        const createdMessage = await Message.create(message);
        if(!createdMessage) {
            console.error('Failed to create channel message:', message);
            return;
        }

        const channel = await Channel.findOneAndUpdate(
                  { _id: channelId }, 
                    
                    { $push: { messages: createdMessage._id } },
                    { new: true }
                );
                

        if (!channel) {
            console.error('Channel not found or failed to update:', channelId);
            return;
        }
        const messageData = await Message.findById(createdMessage._id)
                    .populate('sender', '-password')

        
           const plainMessage = messageData.toObject();
           plainMessage.channelId = channelId;

 
            

        console.log('Channel message sent:', plainMessage);

            channel.members.forEach(member => {
          const socketId = userSocketMap.get(member.toString());
          console.log(`Socket ID for member ${member}: ${socketId}`);

          if(socketId){
            console.log(`Emitting message to socket ID ${socketId}`);

          io.to(socketId).emit("receiveChannelMessage", plainMessage);}
          });
        
    }


    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User ${userId} connected with socket ID: ${socket.id}`);
        } else {
            console.warn('User ID not provided in handshake query');
        }
        console.log('A user connected:', socket.id);

        socket.on('send-channel-message', sendChannelMessage);
        socket.on('send-message', sendMessage);
        socket.on('disconnect', () => disconnect(socket));

    });

    return io;
    
}
export default setUpSocket;