const Notes = require('../models/Notes')

// Create a new note
async function createNote(title, content, userId){
    return await Notes.create({
        title,
        content,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
    });
}

async function getNotesById(userId) {
    return await Notes.findAll({where: {userId, deleted: false} });
}

async function updateNote(id, title, content) {
    const note = await Notes.findByPk(id);
    if (!note || note.deleted) {
        throw new Error('Note not found');
    }
    return await note.update({title, content});
}

async function deleteNote(noteId, userId) {
    try {
        const note = await Notes.findOne({ where: { id: noteId, userId } });
        if (!note) {
            throw new Error('Note not found');
        }

        note.deleted = true; // Mark as deleted
        note.deletedBy = userId; // Record who deleted the note
        await note.save(); // Save the changes (soft delete)

        await note.destroy(); // Soft delete
    } catch (error) {
        throw new Error(`Error deleting note: ${error.message}`);
    }
}


module.exports = {
    createNote,
    getNotesById,
    updateNote,
    deleteNote
};