<template>
  <div class="offcanvas offcanvas-start" tabindex="-1" id="projectOffcanvas" aria-labelledby="projectOffcanvasLabel">
    <div class="offcanvas-header">
      <div>

        <slot name="offCanvasTitle"></slot>

      </div>
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">

      <slot name="offCanvasBody"></slot>

    </div>
  </div>
</template>


<script>
</script>


<style lang="scss" scoped></style>