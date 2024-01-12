<template>
  <div v-if="account.id">
    <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#projectOffcanvas"
      aria-controls="projectOffcanvas">
      See Your Projects
    </button>
    <!-- <p>Projects</p>
    <p>A list of all the projects for {{ account.email }}</p>
    <div class="d-flex justify-content-around">
      <p>Name</p>
      <p>Members</p>
      <p>Started</p>
    </div> -->
    <div>
      <ProjectListComponent />

    </div>
  </div>
</template>

<script>
import { watch, computed, onMounted } from "vue"
import Pop from "../utils/Pop.js"
import { projectsService } from "../services/ProjectsService.js"
import { AppState } from "../AppState.js";
import { logger } from "../utils/Logger.js";


export default {
  setup() {
    let account = computed(() => AppState.account)
    let projects = computed(() => AppState.projects)

    onMounted(() => {
      getProjects();
    })

    watch(
      account,
      () => {
        getProjects();
      }
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

    return {
      account,
      projects,
    }
  }
}
</script>

<style scoped lang="scss">
.home {
  display: grid;
  height: 80vh;
  place-content: center;
  text-align: center;
  user-select: none;

  .home-card {
    width: 50vw;

    >img {
      height: 200px;
      max-width: 200px;
      width: 100%;
      object-fit: contain;
      object-position: center;
    }
  }
}
</style>
