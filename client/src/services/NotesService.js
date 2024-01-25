import { AppState } from "../AppState.js";
import { Project } from "../models/Project.js";
import { logger } from "../utils/Logger.js";
import { api } from "./AxiosService.js";
import { Sprint } from "../models/Sprint.js";
import { Note } from "../models/Note.js"

class NotesService {

  async createNote(noteBody) {
    let newNote = {}
    logger.log(noteBody, AppState.activeTask)
    newNote.body = noteBody
    newNote.taskId = AppState.activeTask.id
    newNote.projectId = AppState.activeTask.projectId
    logger.log("Newnote", newNote)
    const res = await api.post(`api/notes`, newNote)
    logger.log(res.data)
    AppState.notes.push(new Note(res.data))
  }

  async removeNote(noteId) {
    const res = await api.delete(`api/notes/${noteId}`)
    let noteIndex = AppState.notes.findIndex(note => note.id == noteId)
    AppState.notes.splice(noteIndex, 1)
  }



}

export const notesService = new NotesService()