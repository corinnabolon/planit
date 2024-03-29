<template>
  <div class="container-fluid">
    <section class="row">
      <div class="col-1 mt-3 ps-0">
        <SideMenu />
      </div>
      <div class="col-11">
        <div v-if="project" class="d-flex align-items-center mt-3">
          <div>
            <p class="mb-0 fs-1">{{ project.name }}</p>
          </div>
          <p v-if="project.creatorId == account.id" @click="removeProject" class="mb-0 ms-2 fs-1" role="button"
            title="Delete this project">
            <i class="mdi mdi-delete-forever"></i>
          </p>
        </div>
        <p v-if="project" class="fs-5">{{ project.description }}</p>
        <section class="row">
          <div class="col-12 d-flex justify-content-between my-5">
            <div>
              <p class="md-0">Sprints</p>
              <p>Group your tasks into sprints for over-arching collections for better organization.</p>
            </div>
            <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#createSprintModal">Add Sprint</button>
          </div>
        </section>
        <section class="row">
          <div v-for="sprint in sprints" :key="sprint.id" class="col-12 px-1 mb-3 sprint-border">
            <SprintComponent :sprintProp="sprint" />
          </div>
        </section>
      </div>
    </section>
  </div>

  <ModalComponent :modalId="'createSprintModal'">
    <template #modalTitle>
      <p class="modal-title fs-5" id="createSprint">Create a Sprint</p>
    </template>
    <template #modalBody>
      <CreateSprintForm />
    </template>
  </ModalComponent>

  <ModalComponent :modalId="'createTaskModal'">
    <template #modalTitle>
      <p class="modal-title fs-5" id="createTask">Create a Task</p>
    </template>
    <template #modalBody>
      <CreateTaskForm />
    </template>
  </ModalComponent>

  <ModalComponent :modalId="'editProjectModal'">
    <template #modalTitle>
      <p class="modal-title fs-5" id="editProject">Edit Project</p>
    </template>
    <template #modalBody>
      <EditProjectForm />
    </template>
  </ModalComponent>
</template>


<script>
import { AppState } from '../AppState';
import { computed, reactive, onMounted, watch, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Pop from "../utils/Pop.js";
import { projectsService } from "../services/ProjectsService.js";
import { logger } from "../utils/Logger.js";
import ModalComponent from '../components/ModalComponent.vue';
import CreateSprintForm from "../components/CreateSprintForm.vue";
import CreateTaskForm from "../components/CreateTaskForm.vue";
import EditProjectForm from "../components/EditProjectForm.vue";

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const watchableProjectId = computed(() => route.params.projectId)

    onMounted(() => {
      getProjects()
    })


    watch(watchableProjectId, () => {
      clearDataForProjectPage()
      getProjectById(watchableProjectId.value)
      getSprintsByProjectId(watchableProjectId.value)
      getTasksByProjectId(watchableProjectId.value)
      getNotesByProjectId(watchableProjectId.value)
      getProjects()
    },
      { immediate: true }
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

    async function clearDataForProjectPage() {
      try {
        await projectsService.clearDataForProjectPage()
      } catch (error) {
        Pop.error(error)
      }
    }

    async function getProjectById(projectId) {
      try {
        await projectsService.getProjectById(projectId)
      } catch (error) {
        Pop.error(error)
      }
    }

    async function getSprintsByProjectId(projectId) {
      try {
        await projectsService.getSprintsByProjectId(projectId)
      } catch (error) {
        Pop.error(error)
      }
    }

    async function getTasksByProjectId(projectId) {
      try {
        await projectsService.getTasksByProjectId(projectId)
      } catch (error) {
        Pop.error(error)
      }
    }

    async function getNotesByProjectId(projectId) {
      try {
        await projectsService.getNotes(projectId)
      } catch (error) {
        Pop.error(error)
      }
    }

    return {
      watchableProjectId,
      project: computed(() => AppState.project),
      sprints: computed(() => AppState.sprints),
      account: computed(() => AppState.account),
      lastEditedProject: computed(() => AppState.lastEditedProject),

      async removeProject() {
        try {
          const wantsToRemoveProject = await Pop.confirm("Are you sure you want to delete this project?")
          if (!wantsToRemoveProject) {
            return
          }
          const projectId = route.params.projectId
          await projectsService.removeProject(projectId)
          Pop.success("Project deleted!")
          router.push({ name: 'Home' })
        } catch (error) {
          Pop.error(error)
        }
      },


    }
  },
  components: { ModalComponent, CreateSprintForm, CreateTaskForm, EditProjectForm }
};
</script>


<style lang="scss" scoped>
.sprint-border {
  border: 2px solid pink;
}
</style>