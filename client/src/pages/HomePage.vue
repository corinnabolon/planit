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
        <!-- //Basic account info here? -->

      </div>
    </section>
  </div>
</template>

<script>
import { watch, computed, onMounted } from "vue"
import Pop from "../utils/Pop.js"
import { projectsService } from "../services/ProjectsService.js"
import { AppState } from "../AppState.js";
import { logger } from "../utils/Logger.js";
import { useRouter } from 'vue-router';


export default {
  setup() {
    const router = useRouter()
    let account = computed(() => AppState.account)
    let projects = computed(() => AppState.projects)
    let defaultProject = computed(() => AppState.projects[0])

    onMounted(() => {
      getProjects();
      goLastProject();
    })

    watch(
      account,
      () => {
        getProjects();
        goLastProject();
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

    async function goLastProject() {
      await projectsService.getLastProject()
      logger.log("lastEditedProject", AppState.lastEditedProject)
      let projectId = AppState.lastEditedProject.id
      router.push({ name: 'ProjectDetails', params: { projectId: projectId } })
    }

    return {
      router,
      account,
      projects,
      defaultProject,
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
