import express from 'express';
import {  getAllMessages, sendMessage } from '../controllers/MessageController.js';

import { protect } from '../middlewares/AuthMiddleware.js';
import { getContactsForDMList } from '../controllers/ContactController.js';
import {fileUpload} from "../middlewares/Multer.js"

const router = express.Router();
// Send a message
router.post('/send-message', protect, sendMessage);
// Get messages for a conversation  
router.post('/get-message', protect, getAllMessages);
router.get('/dm-list', protect, getContactsForDMList); 
// Delete a message
// router.delete('/delete/:id', protect, deleteMessage);
// Export the router
router.post('/file-upload', fileUpload.single('url'), (req, res) => {
 if (!req.file) {
    return res.status(400).json({ error: 'File not uploaded' });
  }

  const fileURL = `uploads/files/${req.file.filename}`;
  console.log("fileURL". fileURL);
  return res.status(200).json({ url: fileURL });
});
  
export default router;
