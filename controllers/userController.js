import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { generateUserReport } from '../services/pdfService.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Upload profile picture
// @route   POST /api/users/upload
// @access  Private
export const uploadProfilePic = async (req, res, next) => {
    try {
        if (!req.file) {
            return errorResponse(res, 'Please upload a file', 400);
        }

        successResponse(res, 'File uploaded successfully', {
            file: req.file.filename,
            path: `/uploads/${req.file.filename}`,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Download User Report
// @route   GET /api/users/report
// @access  Private
export const downloadReport = async (req, res, next) => {
    try {
        const filePath = path.join(__dirname, '../uploads', `report-${req.user._id}.pdf`);
        
        await generateUserReport(req.user, filePath);

        res.download(filePath, `report-${req.user.name}.pdf`, (err) => {
            if (err) {
                next(err);
            }
            // Optional: delete file after download
            // fs.unlinkSync(filePath);
        });
    } catch (err) {
        next(err);
    }
};
