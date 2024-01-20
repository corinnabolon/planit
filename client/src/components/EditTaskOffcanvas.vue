<template>
  <div class="offcanvas offcanvas-end" tabindex="-1" id="editTaskOffcanvas" aria-labelledby="editTaskOffcanvas">
    <div class="offcanvas-header">
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      <p v-if="sprintNumber" class="fs-5">S{{ sprintNumber + 1 }}</p>
      <p v-if="activeSprint">{{ activeSprint.name }} ></p>
      <p v-if="activeTask">{{ activeTask.name }}</p>
      <p><i class="mdi mdi-pencil"></i></p>
    </div>
    <div class="offcanvas-body">
      <p>Status</p>
      <div v-if="activeTask" class="d-flex">
        <p v-if="activeTask.isComplete" class="rounded-pill bg-success text-dark px-3 py-1 fs-4">Done
        </p>
        <p v-else class="rounded-pill bg-secondary text-light px-3 py-1 fs-4">Pending</p>
      </div>
      <p class="fs-4 text-center">Notes</p>
      <p>Add a Note</p>
      <form @submit.prevent="submitNote()">
        <div class="mb-3 d-flex">
          <textarea v-model="editable" type="text" class="form-control" id="movieTitle"></textarea>
          <button class="btn btn-primary" type="submit"><i class="mdi mdi-send"></i></button>
        </div>
      </form>
      <div v-for="note in notes" :key="note.id" class="note-border rounded my-2 mx-1 px-2">
        <div class="d-flex justify-content-between align-items-center">
          <img :src="note.creator.picture" alt="Creator picture" class="rounded-circle creator-image my-1">
          <p class="mb-3">{{ note.creator.name }}</p>
        </div>
        <div>
          <p class="mb-3">{{ note.body }}</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { AppState } from '../AppState';
import { computed, reactive, onMounted, ref, watch } from 'vue';
import Pop from "../utils/Pop.js";
import { notesService } from "../services/NotesService.js";
import { logger } from "../utils/Logger.js";
import { Note } from "../models/Note.js"


export default {
  setup() {
    let editable = ref("")

    return {
      editable,
      activeSprint: computed(() => AppState.activeSprint),
      activeTask: computed(() => AppState.activeTask),
      notes: computed(() => {
        let notesPerTask = []
        if (AppState.notes.length && AppState.activeTask) {
          AppState.notes.forEach((note) => {
            if (note.taskId == AppState.activeTask.id) {
              notesPerTask.push(note)
            }
          })
          return notesPerTask
        }
        return AppState.notes
      }),
      sprintNumber: computed(() => {
        if (AppState.sprints.length && AppState.activeSprint) {
          return AppState.sprints.findIndex((sprint) => sprint.id == AppState.activeSprint.id)
        }
        return null
      }),

      async submitNote() {
        try {
          let noteBody = editable.value
          await notesService.createNote(noteBody)
          editable.value = ""
        } catch (error) {
          Pop.error(error)
        }
      },



    }
  }
};
</script>


<style lang="scss" scoped>
textarea {
  height: 10rem;
  width: 75%;
}

.creator-image {
  height: 3rem;
}

.note-border {
  border: 1px solid magenta;
}
</style>