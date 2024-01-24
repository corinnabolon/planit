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
      <div v-for="note in notes" :key="note.id" class="comment-box rounded my-2 mx-1 px-2">
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex justify-content-start align-items-center">
            <img :src="note.creator.picture" alt="Creator picture" class="rounded-circle creator-image my-1">
            <p class="mb-0 ms-3">{{ note.creator.name }}</p>
          </div>
          <p @click="deleteNote(`${note.id}`)" v-if="note.creator.id == account.id" role="button"
            title="Delete this comment"><i class="mdi mdi-delete"></i></p>
        </div>
        <div>
          <p class="mb-3">{{ note.body }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <form @submit.prevent="editTask()">
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
              <option v-for="sprint in sprints" :key="sprint.id" :value="sprint.id">{{ sprints.indexOf(sprint) + 1 }} {{
                sprint.name }}
              </option>
            </select>
          </div>
          <div>
            <p class="ms-2 mt-3">Status</p>
            <div class="mt-1 d-flex justify-content-center">
              <button type="button" @click="toggleStatus('pending')" class="btn rounded-pill status-btn"
                :class="{ 'pending': status === 'pending' }">Pending</button>
              <button type="button" @click="toggleStatus('done')" class="btn rounded-pill status-btn"
                :class="{ 'done': status === 'done' }">Done</button>
            </div>
          </div>
          <div class="d-flex justify-content-end mt-3">
            <button type="button" class="btn btn-danger me-2" data-bs-dismiss="offcanvas"
              aria-label="Cancel">Close</button>
            <button type="submit" class="btn btn-success me-2">Save</button>
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
import { tasksService } from "../services/TasksService.js"
import { Offcanvas } from "bootstrap";



export default {

  setup() {
    let editable = ref("")
    let wantsToSeeEditScreen = ref(false)
    let editableTask = ref({ ...AppState.activeTask })
    const getActiveTask = () => AppState.activeTask;
    let isComplete = ref(false);
    let status = ref(isComplete.value ? 'done' : 'pending');
    //The above getActiveTask is a getter function used to get the current state of AppState.activeTask--an arrow function with the return value of AppState.activeTask
    //assigning the function a variable encapsulates the logic of obtaining AppState.activeTask

    //TODO: reset isComplete if offCanvas is closed without the change being sent to the API

    onMounted(() => {
      let editTaskOffCanvasElem = document.getElementById('editTaskOffcanvas')
      editTaskOffCanvasElem.addEventListener('hidden.bs.offcanvas', function (event) {
        getActiveTask()
        editableTask.value = { ...AppState.activeTask };
        if (AppState.activeTask && 'isComplete' in AppState.activeTask) {
          isComplete.value = AppState.activeTask.isComplete;
          status.value = isComplete.value ? 'done' : 'pending'
        }
      })
    })


    watch(() => getActiveTask(),
      //We are watching the result of getActiveTask (which points to AppState.activeTask) to respond to changes in it by performing the following code--when AppState.activeTask changes, the watch is triggered, and it used nextTick to wait for the DOM (data representation of the objects) update cycle, and after that update cycle the editableTask ref is updated to the current value
      async (newActiveTask) => {
        //newActiveTask is a parameter representing the new value returned by the getter getActiveTask--the watch function is passing getActiveTask (and thus AppState.activeTask) through as an argument
        await nextTick();
        // nextTick is a Vue function which schedules a callback to be run after the next DOM cycle--performs operations after the DOM has been updated, ensuring that changes are reflected.  We await it to be sure that the DOM is consistant and is needed because getting the activeTask from the API is asyncronous
        editableTask.value = { ...newActiveTask };
        if (newActiveTask && 'isComplete' in newActiveTask) {
          isComplete.value = newActiveTask.isComplete;
          status.value = isComplete.value ? 'done' : 'pending'
        }
        // isComplete.value = AppState.activeTask.isComplete;
        // status.value = newActiveTask.isComplete ? 'done' : 'pending';
        logger.log("Triggered, AppState.activeTask", AppState.activeTask)
      },
      { immediate: true }
    );

    //more explanation:
    //This is specific to Vue's watch function:
    // When you use the version of watch with a getter function as the first argument, the callback function will indeed receive the new value of the watched expression as its first parameter. <--in this case it is a getter getting a getter
    // watch(() => getActiveTask(), async (newActiveTask) => { ... }):

    // The watch function takes two arguments: the first one is the getter function, and the second is the callback function.
    // Getter Function () => getActiveTask():

    // This is a getter function that returns the current value of AppState.activeTask.
    // Whenever the value returned by this getter function changes (due to changes in AppState.activeTask), the watch function triggers the callback.
    // Callback Function async (newActiveTask) => { ... }:

    // The callback function is executed whenever the value returned by the getter function changes.
    // newActiveTask is a parameter representing the new value returned by the getter function. This parameter holds the latest value of AppState.activeTask.
    // So, to sum it up, changes in getActiveTask() trigger the callback function, and the new value (which is the latest value of AppState.activeTask) is passed as the argument (newActiveTask) to the callback function.

    // This mechanism allows you to react to changes in a reactive source, and the argument of the callback represents the new value of that source after the change. If you have any more questions or need further clarification, feel free to ask!


    return {
      status,
      isComplete,
      wantsToSeeEditScreen,
      editable,
      editableTask,
      account: computed(() => AppState.account),
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

      toggleStatus(selectedStatus) {
        logger.log("Current isComplete", this.isComplete)
        if (selectedStatus == this.status) {
          return;
        }
        this.status = selectedStatus;
        this.isComplete = selectedStatus === 'done';
        logger.log("Current isComplete", this.isComplete)
      },

      //TODO: let people delete their notes

      async editTask() {
        try {
          let wantsToSaveChanges = await Pop.confirm("Are you sure you want to edit the details of this task?")
          if (!wantsToSaveChanges) {
            return
          }
          let taskData = editableTask.value
          taskData.isComplete = this.isComplete
          await tasksService.editTask(taskData)
          Pop.success("Task edited!")
          Offcanvas.getOrCreateInstance('#editTaskOffcanvas').hide()
        } catch (error) {
          Pop.error(error)
        }
      },

      async deleteNote(noteId) {
        try {
          let wantsToDelete = await Pop.confirm("Are you sure you want to delete this note?")
          if (!wantsToDelete) {
            return
          }
          await notesService.deleteNote(noteId)
        } catch (error) {
          Pop.error(error)
        }
      }



    }
  }
};
</script>


<style lang="scss" scoped>
textarea {
  height: 10rem;
  width: 75%;
}

.comment-box {
  width: 75%;
  border: 1px solid magenta;
}

.creator-image {
  height: 3rem;
}

.status-btn {
  padding: 10px 15px;
  margin: 5px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.status-btn.pending {
  background-color: #3498db;
  color: #fff;
}

.status-btn.done {
  background-color: #2ecc71;
  color: #fff;
}
</style>