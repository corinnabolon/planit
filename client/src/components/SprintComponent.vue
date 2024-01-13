<template>
  <div class="d-flex justify-content-evenly">
    <p v-if="sprints">S{{ sprintNumber + 1 }} - {{ sprintProp.name }}</p>
    <p @click="setActiveSprint(`${sprintProp.id}`)" role="button" data-bs-toggle="modal"
      data-bs-target="#createTaskModal">Add Task</p>
  </div>
  <div v-if="tasks">
    Tasks: {{ tasks }}
  </div>
</template>


<script>
import { AppState } from '../AppState';
import { computed, reactive, onMounted } from 'vue';
import { Sprint } from "../models/Sprint.js";
import { sprintsService } from "../services/SprintsService.js";

export default {
  props: { sprintProp: { type: Sprint, required: true } },

  setup(props) {
    return {
      sprints: computed(() => AppState.sprints),
      sprintNumber: computed(() => AppState.sprints.findIndex(sprint => sprint.id == props.sprintProp.id)),
      tasks: computed(() => {
        let movesPerSprint = []
        AppState.tasks.forEach((task) => {
          if (task.sprintId == props.sprintProp.id) {
            movesPerSprint.push(task)
          }
        })
        return movesPerSprint
      }),

      setActiveSprint(sprintId) {
        sprintsService.setActiveSprint(sprintId)
      }
    }
  }
};
</script>


<style lang="scss" scoped></style>