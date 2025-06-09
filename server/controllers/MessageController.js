import Message from "../models/Message.js";

export const getAllMessages = async (req, res, next) => {
    try{
        const user1= req.user.id;
        const user2= req.body.id;

        if(!user1 ){
            return res.status(400).json({message: " User1 IDs are required"});
        }
        if( !user2){
            return res.status(400).json({message: " User2 IDs are required"});
        }

        const messages= await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 }
            ],
        }).sort({ timestamp: 1 });
        
            return res.status(200).json({messages});


    }
    catch(error){
        console.error("Error fetching messages:", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
};

export const sendMessage = async (req, res, next) => {
    try {
        const { recipient, messageType, content, fileUrl } = req.body;
        const sender = req.user._id;

        if (!recipient || !messageType || (!content && !fileUrl)) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newMessage = new Message({
            sender,
            recipient,
            messageType,
            content,
            fileUrl
        });

        const savedMessage = await newMessage.save();
        return res.status(201).json(savedMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};  

