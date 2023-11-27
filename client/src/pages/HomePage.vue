<template>
  <div>
    {{ projects[0] }}
  </div>
</template>

<script>
import { watch, computed } from "vue"
import Pop from "../utils/Pop.js"
import { projectsService } from "../services/ProjectsService.js"
import { AppState } from "../AppState.js";


export default {
  setup() {
    let account = computed(() => AppState.account)


    watch(
      account,
      () => {
        getProjects();
      },
      { immediate: true }
    );

    async function getProjects() {
      try {
        await projectsService.getProjects()
      } catch (error) {
        Pop.error(error)
      }
    }

    return {
      projects: computed(() => AppState.projects)
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
