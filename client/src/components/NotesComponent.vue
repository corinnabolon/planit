<template>
  <div class="offcanvas offcanvas-end" tabindex="-1" id="notesOffcanvas" aria-labelledby="notesOffcanvas">
    <div class="offcanvas-header">
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      <p class="fs-5">S{{ sprintNumber + 1 }}</p>
      <p v-if="activeSprint">{{ activeSprint.name }} ></p>
      <p v-if="activeTask">{{ activeTask.name }}</p>
      <p><i class="mdi mdi-pencil"></i></p>
    </div>
    <div class="offcanvas-body">
      ...
    </div>
  </div>
</template>


<script>
import { AppState } from '../AppState';
import { computed, reactive, onMounted } from 'vue';
export default {
  setup() {
    return {
      activeSprint: computed(() => AppState.activeSprint),
      activeTask: computed(() => AppState.activeTask),
      sprintNumber: computed(() => AppState.sprints.findIndex(sprint => sprint.id == AppState.activeSprint.id)),


    }
  }
};
</script>


<style lang="scss" scoped></style>