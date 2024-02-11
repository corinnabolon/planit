<template>
  <form @submit.prevent="createTask()">
    <div class="d-flex justify-content-around">
      <div class="col-5 mb-3">
        <label for="taskName" class="form-label">Task Name</label>
        <input v-model="editable.name" type="text" class="form-control" id="taskName" aria-describedby="taskName"
          maxlength="50" minlength="1">
      </div>
      <div class="col-3 mb-3">
        <label for="taskWeight" class="form-label">Task Weight</label>
        <input v-model="editable.weight" type="number" class="form-control" id="taskWeight" maxlength="5" minlength="1">
      </div>
    </div>
    <div class="d-flex justify-content-end mb-3 me-3">
      <button type="submit" class="btn btn-primary">Submit</button>
    </div>
  </form>
</template>


<script>
import { AppState } from '../AppState';
import { computed, reactive, onMounted, ref } from 'vue';
import Pop from "../utils/Pop.js";
import { tasksService } from "../services/TasksService.js";
import { useRoute, useRouter } from 'vue-router';
import { Modal } from "bootstrap";

export default {
  setup() {
    let editable = ref({});
    const route = useRoute()

    return {
      editable,

      async createTask() {
        try {
          let sprintId = AppState.activeSprint.id
          let taskData = editable.value
          taskData.sprintId = sprintId
          taskData.projectId = route.params.projectId
          Modal.getOrCreateInstance("#createTaskModal").hide()
          await tasksService.createTask(taskData)
          Pop.success("Task created")
          editable.value = {}
        } catch (error) {
          Pop.error(error)
        }
      }

    }
  }
};
</script>


<style lang="scss" scoped></style>