// controllers/notesControllers.js
const notesService = require('../services/notesService');
const path = require('path');
const Notes = require('../models/Notes');
const fs = require('fs');
const puppeteer = require('puppeteer');
const excelService = require('../services/excelService');

// Controller for creating notes
async function createNote(req, res) {
    try {
        const { title, content, userId } = req.body;
        const note = await notesService.createNote(title, content, userId);
        res.status(201).json(note);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Controller for retrieving notes
async function getNotes(req, res) {
    try {
        const { userId } = req.params;
        const notes = await notesService.getNotesById(userId);
        res.status(200).json(notes);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Controller for updating notes
async function updateNote(req, res) {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const updatedNote = await notesService.updateNote(id, title, content);
        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }   
}

// Controller for deleting notes
async function deleteNote(req, res) {
    try {
        const { noteId } = req.params;
        const userId = req.user.id; // Assuming user ID is available through middleware

        await notesService.deleteNote(noteId, userId);
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Controller for generating a PDF for a note
async function generateNotePDF(req, res) {
    try {
        const { id } = req.params;

        // Fetch the note from the database
        const note = await Notes.findOne({ where: { id } });
        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        // Read the HTML template
        const templatePath = path.join(__dirname, '../templates/pdfTemplateNotes.html');
        let html = fs.readFileSync(templatePath, 'utf-8');

        // Replace placeholders with note data
        html = html.replace('{{title}}', note.title);
        html = html.replace('{{content}}', note.content);

        // Generate a timestamp for the PDF file name
        const timestamp = new Date().toISOString().replace(/[:.-]/g, ''); // Format timestamp for file name
        const pdfFileName = `note-${id}-${timestamp}.pdf`;
        const pdfPath = path.join(__dirname, `../pdfs/notes/${pdfFileName}`);

        // Launch Puppeteer to generate the PDF
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);
        await page.pdf({ path: pdfPath, format: 'A4' });
        await browser.close();

        // Respond with the PDF file path or download link
        const pdfUrl = `http://localhost:3000/notes/pdf/notes/${pdfFileName}`;
        res.status(200).json({ message: "PDF generated successfully", pdfUrl });
    } catch (error) {
        console.error('Error generating PDF:', error); // Log error details
        res.status(500).json({ error: "Failed to generate PDF", details: error.message });
    }
}

// Controller for generating an Excel file for a note
async function generateNoteExcel(req, res) {
    try {
        const { id } = req.params;

        // Fetch the note from the database
        const note = await Notes.findOne({ where: { id } });
        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }

        // Generate a timestamp for the Excel file name
        const timestamp = new Date().toISOString().replace(/[:.-]/g, ''); // Format timestamp for file name
        const excelFileName = `note-${id}-${timestamp}.xlsx`;
        const excelPath = path.join(__dirname, `../excel/${excelFileName}`);

        // Generate the Excel file
        await excelService.generateExcel(note, excelPath);

        // Respond with the Excel file path or download link
        const excelUrl = `http://localhost:3000/excel/notes/${excelFileName}`;
        res.status(200).json({ message: "Excel file generated successfully", excelUrl });
    } catch (error) {
        console.error('Error generating Excel file:', error); // Log error details
        res.status(500).json({ error: "Failed to generate Excel file", details: error.message });
    }
}

module.exports = {
    createNote,
    getNotes,
    updateNote,
    deleteNote,
    generateNotePDF,
    generateNoteExcel
};
