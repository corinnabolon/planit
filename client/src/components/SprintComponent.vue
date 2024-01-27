<template>
  <div class="d-flex justify-content-between fs-3">
    <div class="d-flex">
      <p v-if="sprints">S{{ sprintNumber + 1 }} - {{ sprintProp.name }}</p>
      <p v-if="tasks" class="ms-5">{{ tasksWeight }}<i class="mdi mdi-weight"></i></p>
    </div>
    <div class="d-flex">
      <p @click="setActiveSprint(sprintProp)" role="button" data-bs-toggle="modal" data-bs-target="#createTaskModal"
        class="me-4">Add Task</p>
      <p v-if="completedTasks && tasks">{{ completedTasks.length }} / {{ tasks.length }} Tasks
        Complete</p>
    </div>
  </div>
  <section class="row">
    <div v-for="task in tasks" :key="task.id" class="col-9">
      <TaskComponent :taskProp="task" />
    </div>
    <div v-if="!task" class="col-9"></div>
    <div class="col-3 d-flex align-items-end">
      <div @click="removeSprint(sprintProp)" role="button" class="d-flex align-items-center">
        <p v-if="sprints" class="mb-0 fs-4">Delete Sprint {{ sprintNumber + 1 }}</p>
        <p class="mb-0"><i class="ms-3 fs-2 mdi mdi-delete-forever"></i></p>
      </div>
    </div>
  </section>
</template>


<script>
import { AppState } from '../AppState';
import { computed, reactive, onMounted } from 'vue';
import { Sprint } from "../models/Sprint.js";
import { sprintsService } from "../services/SprintsService.js";
import Pop from "../utils/Pop.js";
import { logger } from "../utils/Logger.js";

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
      tasksWeight: computed(() => {
        let totalTaskWeight = 0
        AppState.tasks.forEach((task) => {
          if (task.sprintId == props.sprintProp.id) {
            totalTaskWeight += task.weight
          }
        })
        return totalTaskWeight
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

      async removeSprint(sprintData) {
        try {
          const wantsToDelete = await Pop.confirm("Are you sure you want to delete this sprint and all its associated tasks and notes?")
          if (!wantsToDelete) {
            return
          }
          let sprintId = sprintData.id
          await sprintsService.removeSprint(sprintId)
          Pop.success(`${sprintData.name} deleted`)
        } catch (error) {
          Pop.error(error)
        }
      },

      setActiveSprint(sprintData) {
        let sprintId = sprintData.id
        sprintsService.setActiveSprint(sprintId)
        logger.log("Setting active Sprint", AppState.activeSprint)
      }
    }

  },

};
</script>


<style lang="scss" scoped>
.sprint-border {
  border: 2px solid pink;
}
</style>