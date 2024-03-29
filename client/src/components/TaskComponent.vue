<template>
  <section class="row">
    <div class="col-1 text-end fs-4">
      <input @click="toggleCompleteOrNot(`${taskProp.id}`)" class="form-check-input" :checked="isChecked" type="checkbox"
        value="" id="flexCheckDefault" :key="checkboxKey">
      <div :class="[taskProp.isComplete ? 'vl-success' : 'vl-danger']"></div>
    </div>
    <div @click="setActives" class="col-6 fs-5" type="button">
      <div class="d-flex">
        <p class="rounded-pill text-light px-3" :class="[taskProp.isComplete ? 'bg-secondary' : 'bg-danger']">{{
          taskProp.name
        }}</p>
        <p v-if="taskProp.creatorId == account.id" @click.stop="removeTask(taskProp)"><i
            class="mdi mdi-delete-forever ms-4" title="Delete task"></i></p>
      </div>
      <div class="d-flex">
        <p><i class="mdi mdi-run me-4"></i></p>
        <p>Created - {{ taskProp.createdAt.toDateString() }}</p>
      </div>
      <div class="d-flex mb-5">
        <div class="d-flex">
          <p>{{ notes.length }}</p>
          <p><i class="mdi mdi-message-reply-text"></i></p>
        </div>
        <div class="d-flex ms-5">
          <p>{{ taskProp.weight }}</p>
          <p><i class="mdi mdi-weight"></i></p>
        </div>
      </div>
    </div>



  </section>
</template>


<script>
import { AppState } from '../AppState';
import { computed, reactive, onMounted, ref } from 'vue';
import { Task } from '../models/Task.js'
import { logger } from "../utils/Logger.js";
import Pop from "../utils/Pop.js";
import { tasksService } from "../services/TasksService.js";
import { sprintsService } from "../services/SprintsService.js";
import { projectsService } from "../services/ProjectsService.js";
import { Offcanvas } from "bootstrap";

export default {
  props: { taskProp: { type: Task, required: true } },

  setup(props) {
    let isChecked = computed(() => props.taskProp.isComplete)
    let checkboxKey = ref(0)
    const forceRerender = () => {
      checkboxKey.value += 1;
    }


    return {
      isChecked,
      checkboxKey,
      account: computed(() => AppState.account),

      notes: computed(() => {
        let notesPerTask = []
        AppState.notes.forEach((note) => {
          if (note.taskId == props.taskProp.id) {
            notesPerTask.push(note)
          }
        })
        return notesPerTask
      }),

      async toggleCompleteOrNot(taskId) {
        try {
          let wantsToMarkComplete = await Pop.confirm("Are you sure you want to mark this as complete?")
          if (!wantsToMarkComplete) {
            forceRerender()
            return
          }
          await tasksService.changeStatus(taskId)
        } catch (error) {
          Pop.error(error)
        }
      },

      async setActives() {
        try {
          let task = props.taskProp
          await tasksService.setActiveTask(task.id)
          await sprintsService.setActiveSprint(task.sprintId)
          Offcanvas.getOrCreateInstance('#editTaskOffcanvas').show()
        } catch (error) {
          Pop.error(error)
        }
      },

      async removeTask(taskData) {
        try {
          let wantsToDelete = await Pop.confirm("Do you want to delete this task and its associated notes?")
          if (!wantsToDelete) {
            return
          }
          let taskId = taskData.id
          await tasksService.removeTask(taskId)
          Pop.success(`${taskData.name} deleted!`)
        } catch (error) {
          Pop.error(error)
        }
      }




    }
  }
};
</script>


<style lang="scss" scoped>
.vl-success {
  border-left: 6px solid green;
  height: 80%;
  margin-left: 70%;
}

.vl-danger {
  border-left: 6px solid red;
  height: 80%;
  margin-left: 70%;
}
</style>