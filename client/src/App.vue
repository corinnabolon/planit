<template>
  <header>
    <Navbar />
  </header>
  <main>
    <router-view />
  </main>
  <EditTaskOffcanvas />
</template>

<script>
import { computed } from 'vue'
import { AppState } from './AppState'
import Navbar from './components/Navbar.vue'
import ProjectListComponent from './components/ProjectListComponent.vue'
import EditTaskOffcanvas from './components/EditTaskOffcanvas.vue'

export default {
  setup() {
    return {
      appState: computed(() => AppState)
    }
  },
  components: { Navbar, EditTaskOffcanvas }
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
