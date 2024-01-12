<template>
  <div class="d-flex">
    <p v-if="sprints">S{{ sprintNumber + 1 }} - {{ sprintProp.name }}</p>

  </div>
</template>


<script>
import { AppState } from '../AppState';
import { computed, reactive, onMounted } from 'vue';
import { Sprint } from "../models/Sprint.js";
export default {
  props: { sprintProp: { type: Sprint, required: true } },

  setup(props) {
    return {
      sprints: computed(() => AppState.sprints),
      sprintNumber: computed(() => AppState.sprints.findIndex(sprint => sprint.id == props.sprintProp.id)),
    }
  }
};
</script>


<style lang="scss" scoped></style>