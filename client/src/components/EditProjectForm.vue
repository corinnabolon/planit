<template>
  <form @submit.prevent="editProject()">
    <div class="d-flex justify-content-around">
      <div class="col-5 mb-3">
        <label for="projectName" class="form-label">Name</label>
        <input v-model="editable.name" type="text" class="form-control" id="projectName" aria-describedby="projectName"
          maxlength="50" minlength="1">
      </div>
      <div class="col-3 mb-3">
        <label for="projectDescription" class="form-label">Description</label>
        <input v-model="editable.description" type="text" class="form-control" id="projectDescription" maxlength="1000"
          minlength="1">
      </div>
    </div>
    <div class="d-flex justify-content-end mb-3 me-3">
      <button type="submit" class="btn btn-primary">Submit</button>
    </div>
  </form>
</template>


<script>
import { AppState } from '../AppState';
import { computed, reactive, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Pop from "../utils/Pop.js";
import { projectsService } from "../services/ProjectsService.js";
import { Modal } from "bootstrap";

export default {
  setup() {
    const route = useRoute()
    let editable = ref({})
    let projects = computed(() => AppState.projects)

    onMounted(() => {
      let editProjectModalElem = document.getElementById('editProjectModal')
      editProjectModalElem.addEventListener('show.bs.modal', function (event) {
        fillInRef()
      })
    })

    async function fillInRef() {
      try {
        let projectId = route.params.projectId
        await projectsService.getProjectById(projectId)
        if (AppState.project) {
          editable.value = { ...AppState.project }
        }
      }
      catch (error) {
        Pop.error(error)
      }
    }

    return {
      editable,
      projects,

      async editProject() {
        try {
          let projectId = route.params.projectId
          let projectData = editable.value
          await projectsService.editProject(projectData, projectId)
          Modal.getOrCreateInstance("#editProjectModal").hide()
        } catch (error) {
          Pop.error(error)
        }
      }
    }
  }
};
</script>


<style lang="scss" scoped></style>