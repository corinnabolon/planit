<template>
  <div class="d-flex justify-content-between fs-4">
    <p v-if="sprints">S{{ sprintNumber + 1 }} - {{ sprintProp.name }}</p>
    <div class="d-flex">
      <p @click="setActiveSprint(`${sprintProp.id}`)" role="button" data-bs-toggle="modal"
        data-bs-target="#createTaskModal" class="me-4">Add Task</p>
      <p v-if="completedTasks && tasks">{{ completedTasks.length }} / {{ tasks.length }} Tasks
        Complete</p>
    </div>
  </div>
  <section class="row">
    <div v-for="task in tasks" :key="task.id" class="col-12">
      <TaskComponent :taskProp="task" />
    </div>
  </section>
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
        let tasksPerSprint = []
        AppState.tasks.forEach((task) => {
          if (task.sprintId == props.sprintProp.id) {
            tasksPerSprint.push(task)
          }
        })
        return tasksPerSprint
      }),

      completedTasks: computed(() => {
        let completedTasksPerSprint = []
        AppState.tasks.forEach((task) => {
          if (task.sprintId == props.sprintProp.id && task.isComplete == true) {
            completedTasksPerSprint.push(task)
          }
        })
        return completedTasksPerSprint
      }),

      setActiveSprint(sprintId) {
        sprintsService.setActiveSprint(sprintId)
      }
    }

  },

};
</script>


<style lang="scss" scoped></style>