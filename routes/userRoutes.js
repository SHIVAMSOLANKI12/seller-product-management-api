import express from 'express';
import { uploadProfilePic, downloadReport } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../utils/multer.js';

const router = express.Router();

router.post('/upload', protect, upload.single('image'), uploadProfilePic);
router.get('/report', protect, downloadReport);

export default router;
