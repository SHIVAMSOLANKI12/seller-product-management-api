import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateUserReport = (user, filePath) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            
            // Ensure directory exists
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

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
