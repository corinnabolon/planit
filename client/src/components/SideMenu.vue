<template>
  <div v-if="account.id">
    <div class="fs-1 bg-info text-center" role="button" data-bs-toggle="offcanvas" data-bs-target="#projectOffcanvas"
      aria-controls="projectOffcanvas">
      <p class="mb-0">P</p>
    </div>
    <div class="fs-1 bg-info text-center mt-3" role="button" data-bs-toggle="modal" data-bs-target="#editProjectModal"
      aria-controls="editProjectModal">
      <p class="mb-0"><i class="mdi mdi-cog"></i></p>
    </div>
  </div>
</template>


<script>
import { AppState } from '../AppState';
import { computed, reactive, onMounted } from 'vue';
export default {
  setup() {
    return {
      account: computed(() => AppState.account)

    }
  }
};
</script>


<style lang="scss" scoped></style>