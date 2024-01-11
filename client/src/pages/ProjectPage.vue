<template>
  <div v-if="project" class="component">
    {{ project.name }}

  </div>
</template>


<script>
import { AppState } from '../AppState';
import { computed, reactive, onMounted, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import Pop from "../utils/Pop.js";
import { projectsService } from "../services/ProjectsService.js";
import { logger } from "../utils/Logger.js";

export default {
  setup() {
    const route = useRoute()
    const watchableProjectId = ref(route.params.projectId)

    watch(watchableProjectId, () => {
      getProjectById(watchableProjectId.value)
    },
      { immediate: true }
    );


    async function getProjectById(projectId) {
      try {
        await projectsService.getProjectById(projectId)
      } catch (error) {
        Pop.error(error)
      }
    }

    return {
      watchableProjectId,
      project: computed(() => AppState.project)

    }
  }
};
</script>


<style lang="scss" scoped></style>