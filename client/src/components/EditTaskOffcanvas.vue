<template>
  <div class="offcanvas offcanvas-end" tabindex="-1" id="editTaskOffcanvas" aria-labelledby="editTaskOffcanvas">
    <div class="offcanvas-header align-items-center">
      <div class="col-1">
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="col-10 d-flex align-items-center justify-content-start fs-5">
        <p v-if="sprintNumber != null" class="mb-0 me-2">S{{ sprintNumber + 1 }}</p>
        <p class="mb-0 me-2" v-if="activeSprint">{{ activeSprint.name }}</p>
        <p class="mb-0 me-2">&gt;</p>
        <p class="mb-0 me-2" v-if="activeTask">{{ activeTask.name }}</p>
      </div>
      <div class="col-1">
        <p v-if="!wantsToSeeEditScreen" @click="showEditScreen" role="button" class="mb-0"><i class="mdi mdi-pencil"></i>
        </p>
      </div>
    </div>
    <div v-if="!wantsToSeeEditScreen" class="offcanvas-body">
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
    <div v-else>
      <form @submit.prevent="editTask">
        <div class="col-11 ms-2 mb-3">
          <label for="name" class="form-label">Name</label>
          <input v-model="editableTask.name" type="text" class="form-control" id="taskName" maxlength="50" minlength="1">
        </div>
        <section class="row">
          <div class="col-4 ms-2">
            <div class="d-flex">
              <label for="weight" class="form-label">Weight</label>
              <p><i class="mdi mdi-weight"></i></p>
            </div>
            <input v-model="editableTask.weight" type="number" class="form-control" id="taskWeight">
          </div>
          <div class="col-7 ms-2">
            <div class="d-flex">
              <label for="sprint" class="form-label">Sprint</label>
              <p><i class="mdi mdi-run"></i></p>
            </div>
            <select v-model="editableTask.sprintId" class="form-select" aria-label="Default select example">
              <option v-for="sprint in sprints" :key="sprint.id" :value="sprint">{{ sprints.indexOf(sprint) + 1 }} {{
                sprint.name }}
              </option>
            </select>
          </div>
          <p class="ms-2 mt-3">Status</p>
          <div class="mt-1 d-flex justify-content-center">
            <!-- <button @click="setToIncomplete" class="btn rounded-pill"
              :class="[editableTask.isComplete ? 'btn-success' : 'btn-success-outline']">Pending</button>
            <button @click="setToComplete" class="btn rounded-pill"
              :class="[editableTask.isComplete ? 'btn-success-outline' : 'btn-success']">Done</button> -->
            <!-- <button @click="toggleStatus('pending')" class="btn rounded-pill"
              :class="{ 'active': status === 'pending' }">Pending</button>
            <button @click="toggleStatus('done')" class="btn rounded-pill"
              :class="{ 'active': status === 'done' }">Done</button> -->
          </div>


        </section>
      </form>


      <!-- <form @submit.prevent="createSprint()">
          <div class="d-flex justify-content-around">
            <div class="col-5 mb-3">
              <label for="sprintName" class="form-label">Sprint Name</label>
              <input v-model="editable.name" type="text" class="form-control" id="taskName" aria-describedby="sprintName"
                maxlength="50" minlength="1">
            </div>
          </div>
          <div class="d-flex justify-content-end mb-3 me-3">
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>
        </form> -->



    </div>
  </div>
</template>


<script>
import { AppState } from '../AppState';
import { computed, reactive, onMounted, ref, watch, nextTick } from 'vue';
import Pop from "../utils/Pop.js";
import { notesService } from "../services/NotesService.js";
import { logger } from "../utils/Logger.js";
import { Note } from "../models/Note.js"


export default {

  setup() {
    let editable = ref("")
    let wantsToSeeEditScreen = ref(false)
    let editableTask = ref({ ...AppState.activeTask })
    const getActiveTask = () => AppState.activeTask;

    onMounted(() => {
      let editTaskOffcanvasElem = document.getElementById("editTaskOffcanvas")
      editTaskOffcanvasElem.addEventListener('show.bs.offcanvas', function (event) {
        editableTask.value = { ...AppState.activeTask };
        logger.log("Triggered")
      })
    })


    watch(() => getActiveTask(),
      async (newActiveTask) => {
        await nextTick();
        editableTask.value = { ...newActiveTask };
        logger.log("Triggered, AppState.activeTask", AppState.activeTask)
      },
      { immediate: true }
    );


    return {
      wantsToSeeEditScreen,
      editable,
      editableTask,
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
      sprints: computed(() => AppState.sprints),
      isComplete: false,
      status: '',

      async submitNote() {
        try {
          let noteBody = editable.value
          await notesService.createNote(noteBody)
          editable.value = ""
        } catch (error) {
          Pop.error(error)
        }
      },

      showEditScreen() {
        wantsToSeeEditScreen.value = true
      },

      // toggleStatus(selectedStatus) {
      //   this.isComplete = selectedStatus === 'done';
      //   this.status = selectedStatus;
      // },



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

button.active {
  background-color: #3498db;
  color: #fff;
}
</style>