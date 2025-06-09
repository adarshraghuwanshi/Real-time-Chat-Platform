import User from "../models/User.js";
import Message from "../models/Message.js";

export const searchContacts = async (request, response, next) => {
  try {
    const { searchTerm } = request.body;

    if (searchTerm === undefined || searchTerm === null) {
      return response.status(400).send("searchTerm is required.");
    }

    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regex = new RegExp(sanitizedSearchTerm, "i");

    const contacts = await User.find({
      $and: [
        { _id: { $ne: request.user._id } },
        {
          $or: [
            { firstName: regex },
            { lastName: regex },
            { email: regex }
          ]
        }
      ]
    });

    return response.status(200).json({ contacts });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal Server Error");
  }
};

export const getContactsForDMList = async (request, response, next) => {
  try {
    const userId = request.user._id;
    if (!userId) {
      return response.status(400).send("User ID is required.");
    }
   const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }]
    }).select("sender recipient timestamp").sort({ timestamp: -1 });
    const contactMaps = new Map();

    const myId= userId.toString();

    messages.forEach(msg => {
      let contactId=null;
      if (msg.sender && msg.sender.toString() !== myId) {
        contactId = msg.sender.toString();
      } else if (msg.recipient && msg.recipient.toString() !== myId) {
        contactId = msg.recipient.toString();
      }
     if(contactId && !contactMaps.has(contactId)) {
        contactMaps.set(contactId, msg.timestamp);
      }
    });

    const contactIds = Array.from(contactMaps.keys());

    const contacts = await User.find({
      _id: { $in: (contactIds) }
    }).select("-password");

     const contactsSorted = contacts.sort((a, b) => {
      const timeA = contactMaps.get(a._id.toString());
      const timeB = contactMaps.get(b._id.toString());
      return timeB - timeA; 
    });

    response.status(200).json({ contacts });

  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal Server Error");
  }
};

