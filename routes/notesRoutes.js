// routes/notesRoutes.js
const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesControllers');

// Create a new note
router.post('/notes', notesController.createNote);

// Get all notes for a user
router.post('/notes/:userId', notesController.getNotes);

// Update a note
router.post('/notes/:id', notesController.updateNote);

// Delete a note
router.post('/notes/:id', notesController.deleteNote);

//generate pdf for a note
router.post('/notes/:id/pdf', notesController.generateNotePDF);

//generate excel for a note
router.post('/notes/:id/excel', notesController.generateNoteExcel);

module.exports = router;