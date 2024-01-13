<template>
  <div class="container-fluid">
    <section class="row">
      <div class="col-1">
        <div v-if="account.id">
          <button class="btn btn-primary fs-1" type="button" data-bs-toggle="offcanvas" data-bs-target="#projectOffcanvas"
            aria-controls="projectOffcanvas">
            P
          </button>
        </div>
      </div>
      <div class="col-11">
        <div v-if="project" class="d-flex align-items-center mt-3">
          <div>
            {{ project.name }} {{ project.id }}
          </div>
          <button class="btn btn-success ms-5" v-if="project.creatorId == account.id" @click="removeProject">Delete
            Project</button>
        </div>
        <section class="row">
          <div v-for="sprint in sprints" :key="sprint.id" class="col-12 px-1">
            <SprintComponent :sprintProp="sprint" />
          </div>
        </section>
      </div>
    </section>
  </div>
</template>


<script>
import { AppState } from '../AppState';
import { computed, reactive, onMounted, watch, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Pop from "../utils/Pop.js";
import { projectsService } from "../services/ProjectsService.js";
import { logger } from "../utils/Logger.js";

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const watchableProjectId = computed(() => route.params.projectId)

    watch(watchableProjectId, () => {
      clearDataForProjectPage()
      getProjectById(watchableProjectId.value)
      getSprintsByProjectId(watchableProjectId.value)
      getTasksByProjectId(watchableProjectId.value)
      getProjects()
    },
      { immediate: true }
    );

    async function getProjects() {
      try {
        if (AppState.account) {
          projectsService.clearAllProjects()
          await projectsService.getProjects()
        }
      } catch (error) {
        Pop.error(error)
      }
    }

    async function clearDataForProjectPage() {
      try {
        await projectsService.clearDataForProjectPage()
      } catch (error) {
        Pop.error(error)
      }
    }

    async function getProjectById(projectId) {
      try {
        await projectsService.getProjectById(projectId)
      } catch (error) {
        Pop.error(error)
      }
    }

    async function getSprintsByProjectId(projectId) {
      try {
        await projectsService.getSprintsByProjectId(projectId)
      } catch (error) {
        Pop.error(error)
      }
    }

    async function getTasksByProjectId(projectId) {
      try {
        await projectsService.getTasksByProjectId(projectId)
      } catch (error) {
        Pop.error(error)
      }
    }

    return {
      watchableProjectId,
      project: computed(() => AppState.project),
      sprints: computed(() => AppState.sprints),
      account: computed(() => AppState.account),

      async removeProject() {
        try {
          const wantsToRemoveProject = await Pop.confirm("Are you sure you want to delete this project?")
          if (!wantsToRemoveProject) {
            return
          }
          const projectId = route.params.projectId
          await projectsService.removeProject(projectId)
          Pop.success("Project deleted!")
          router.push({ name: 'Home' })
        } catch (error) {
          Pop.error(error)
        }
      },


    }
  }
};
</script>


<style lang="scss" scoped></style>