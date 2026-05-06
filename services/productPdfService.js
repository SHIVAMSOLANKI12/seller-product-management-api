import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateProductPDF = (product, filePath) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);

            // Header
            doc.fontSize(20).text('Product Catalog', { align: 'center' });
            doc.moveDown();

            // Product Details
            doc.fontSize(16).fillColor('#333').text(`Product: ${product.productName}`);
            doc.fontSize(12).fillColor('#666').text(`Description: ${product.productDescription}`);
            doc.moveDown();

            doc.fontSize(14).fillColor('#000').text('Brands:', { underline: true });
            doc.moveDown(0.5);

            let totalPrice = 0;

            product.brands.forEach((brand, index) => {
                doc.fontSize(12).fillColor('#000').text(`${index + 1}. ${brand.brandName}`);
                doc.fontSize(10).fillColor('#555').text(`   Detail: ${brand.detail || 'N/A'}`);
                doc.fontSize(10).fillColor('#000').text(`   Price: $${brand.price.toFixed(2)}`);

                totalPrice += brand.price;

                // Handle Brand Image if exists
                if (brand.image) {
                    const imgPath = path.join(process.cwd(), brand.image);
                    if (fs.existsSync(imgPath)) {
                        // doc.image(imgPath, { width: 100 });
                        // To avoid overlapping, move down after image or position it
                        // Simplified for now:
                        doc.text(`   [Image: ${brand.image}]`);
                    }
                }
                doc.moveDown();
            });

            doc.moveDown();
            doc.fontSize(14).fillColor('green').text(`Total Price of all brands: $${totalPrice.toFixed(2)}`, { align: 'right' });

            doc.end();

            stream.on('finish', () => resolve(filePath));
            stream.on('error', (err) => reject(err));
        } catch (err) {
            reject(err);
        }
    });
};
