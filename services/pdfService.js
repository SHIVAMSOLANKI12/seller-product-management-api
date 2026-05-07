import PDFDocument from 'pdfkit';
import fs from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';

export const generateUserReport = async (user, filePath) => {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    await mkdir(dir, { recursive: true });

    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // Add content
            doc.fontSize(25).text('User Profile Report', { align: 'center' });
            doc.moveDown();
            doc.fontSize(16).text(`Name: ${user.name}`);
            doc.text(`Email: ${user.email}`);
            doc.text(`Created At: ${user.createdAt}`);
            
            doc.end();

            stream.on('finish', () => {
                resolve(filePath);
            });

            stream.on('error', (err) => {
                reject(err);
            });
        } catch (err) {
            reject(err);
        }
    });
};
