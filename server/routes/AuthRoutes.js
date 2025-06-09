import Express from 'express';
import { signup, login, getUserProfile, updateProfile, getAllUsers } from '../controllers/AuthController.js';
import { protect } from '../middlewares/AuthMiddleware.js';
import { searchContacts } from '../controllers/ContactController.js';
import multer from "multer";
// const upload= multer({dest:'uploads/profile'})
import {upload} from "../middlewares/Multer.js"
const router = Express.Router();

// Register route
router.post('/signup', signup);
// Login route      
router.post('/login', login);
// Logout route
// router.post('/logout', logout);
// Export the router    
router.get("/getUserProfile",protect, getUserProfile);
router.put(
  "/update-profile",
  protect,
  upload.single('image'),
  updateProfile
);
router.post("/search-contacts",protect,   searchContacts)
router.get("/allContacts", protect, getAllUsers);

export default router;