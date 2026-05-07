import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { generateUserReport } from '../services/pdfService.js';
import ErrorResponse from '../utils/errorResponse.js';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Upload profile picture
// @route   POST /api/users/upload
// @access  Private
export const uploadProfilePic = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new ErrorResponse('Please upload a file', 400));
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
    let filePath;
    try {
        const uploadsDir = path.join(__dirname, '../uploads');
        filePath = path.join(uploadsDir, `report-${req.user._id}.pdf`);
        
        // Ensure uploads directory exists
        await fs.mkdir(uploadsDir, { recursive: true });

        await generateUserReport(req.user, filePath);

        res.download(filePath, `report-${req.user.name}.pdf`, async (err) => {
            if (err) {
                if (!res.headersSent) {
                    next(new ErrorResponse('Error downloading report', 500));
                }
            }
            
            // Cleanup: delete file after download attempt
            try {
                if (existsSync(filePath)) {
                    await fs.unlink(filePath);
                }
            } catch (cleanupErr) {
                console.error('Failed to cleanup report PDF:', cleanupErr);
            }
        });
    } catch (err) {
        // If file was created but generation failed, cleanup
        if (filePath && existsSync(filePath)) {
            await fs.unlink(filePath).catch(() => {});
        }
        next(err);
    }
};
