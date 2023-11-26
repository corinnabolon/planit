import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"

class NotesService {

  async createNote(noteData) {
    let note = await dbContext.Notes.create(noteData)
    await note.populate("creator", "name picture")
    await note.populate("task")
    await note.populate("project")
    return note
  }

  async getNotesByProjectId(projectId) {
    let notes = await dbContext.Notes.find({ projectId }).populate("creator", "name picture").populate("task").populate("project")
    return notes
  }

  async removeNote(noteId, userId) {
    let note = await dbContext.Notes.findById(noteId)
    if (!note) {
      throw new BadRequest(`${noteId} is not a valid note ID`)
    }
    if (note.creatorId.toString() != userId) {
      throw new Forbidden("Not your note to delete")
    }
    await note.remove()
    return "Note deleted"
  }

}

export const notesService = new NotesService()