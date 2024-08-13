const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Function to generate an Excel file
function generateExcel(note, outputPath) {
    return new Promise((resolve, reject) => {
        try {
            // Create a new workbook and worksheet
            const wb = XLSX.utils.book_new();
            const wsData = [
                ['Title', 'Content', 'Created At', 'Updated At'],
                [note.title, note.content, note.createdAt, note.updatedAt]
            ];
            const ws = XLSX.utils.aoa_to_sheet(wsData);
            
            // Append the worksheet to the workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Note');

            // Write the workbook to a file
            XLSX.writeFile(wb, outputPath);
            resolve(outputPath);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    generateExcel
};
