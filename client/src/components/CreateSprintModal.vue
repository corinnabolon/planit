<template>
  <div class="modal fade" id="createSprintModal" tabindex="-1" aria-labelledby="createTaskModal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createSprint">Create a Sprint</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="createSprint()">
          <div class="d-flex justify-content-around">
            <div class="col-5 mb-3">
              <label for="sprintName" class="form-label">Sprint Name</label>
              <input v-model="editable.name" type="text" class="form-control" id="sprintTame"
                aria-describedby="sprintName" maxlength="50" minlength="1">
            </div>
          </div>
          <div class="d-flex justify-content-end mb-3 me-3">
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import { AppState } from '../AppState';
import { computed, reactive, onMounted, ref } from 'vue';
import Pop from "../utils/Pop.js";
import { sprintsService } from "../services/SprintsService.js";
import { useRoute, useRouter } from 'vue-router';
import { Modal } from "bootstrap";

export default {
  setup() {
    let editable = ref({});
    const route = useRoute()

    return {
      editable,

      async createSprint() {
        try {
          let sprintData = editable.value
          sprintData.projectId = route.params.projectId
          await sprintsService.createSprint(sprintData)
          Pop.success("Sprint created")
          Modal.getOrCreateInstance("#createSprintModal").hide()
          editable.value = {}
        } catch (error) {
          Pop.error(error)
        }
      }

    }
  }
};
</script>


<style lang="scss" scoped></style>