<template>
  <header>
    <Navbar />
  </header>
  <main>
    <router-view />
  </main>
  <ProjectListComponent />
  <CreateTaskModal />
  <EditTaskOffcanvas />
  <EditProjectModal />
</template>

<script>
import { computed } from 'vue'
import { AppState } from './AppState'
import Navbar from './components/Navbar.vue'
import ProjectListComponent from './components/ProjectListComponent.vue'
import CreateTaskModal from "./components/CreateTaskModal.vue"
import EditTaskOffcanvas from "./components/EditTaskOffcanvas.vue"
import EditProjectModal from "./components/EditProjectModal.vue"
import ModalComponent from './components/ModalComponent.vue';

export default {
  setup() {
    return {
      appState: computed(() => AppState)
    }
  },
  components: { Navbar, ProjectListComponent, CreateTaskModal, EditTaskOffcanvas, EditProjectModal }
}
</script>
<style lang="scss">
@import "./assets/scss/main.scss";

:root {
  --main-height: calc(100vh - 32px - 64px);
}


footer {
  display: grid;
  place-content: center;
  height: 32px;
}
</style>
