const PDFDocument = require('pdfkit');
const fs = require('fs');

function generatePDF(note, outputPath) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();

        // Pipe its output somewhere, like to a file or HTTP response
        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        // Add note content to the PDF
        doc.fontSize(25).text(note.title, { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(note.content, {
            align: 'left'
        });

        // Finalize the PDF and end the stream
        doc.end();

        stream.on('finish', () => {
            resolve(outputPath);
        });

        stream.on('error', (err) => {
            reject(err);
        });
    });
}

module.exports = {
    generatePDF
};
