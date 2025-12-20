<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "App",
})
</script>

<template>
  <div id="app-wrapper">
    <router-view></router-view>
  </div>
</template>

<style scoped>
#app-wrapper {
  min-height: 100vh;
  width: 100%;
}
</style>
