<template>
  <div class="offcanvas offcanvas-start" tabindex="-1" id="projectOffcanvas" aria-labelledby="projectOffcanvasLabel">
    <div class="offcanvas-header">
      <div>
        <p class="fs-5 offcanvas-title" id="projectOffcanvasLabel">Projects</p>
        <p>for {{ account.email }}</p>
      </div>
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <div class="d-flex justify-content-between">
        <p>Name</p>
        <p>Started</p>
      </div>
      <div v-for="project in projects" :key="project.id" class="d-flex justify-content-between">
        <p @click="goProjectDetails(`${project.id}`)" role="button">{{ project.name }}</p>
        <p>{{ project.createdAt.toLocaleDateString() }}</p>
      </div>
    </div>
  </div>
</template>


<script>
import { AppState } from '../AppState';
import { computed, reactive, onMounted, watch } from 'vue';
import Pop from "../utils/Pop.js";
import { projectsService } from "../services/ProjectsService.js";
import { Offcanvas } from "bootstrap";
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter()


    return {
      account: computed(() => AppState.account),
      projects: computed(() => AppState.projects),
      router,

      goProjectDetails(projectId) {
        router.push({ name: 'ProjectDetails', params: { projectId: projectId } })
        Offcanvas.getOrCreateInstance("#projectOffcanvas").hide()
      }
    }
  }
};
</script>


<style lang="scss" scoped></style>