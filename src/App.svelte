<script lang="ts">
  import Camera from "./lib/Camera.svelte";
</script>

<main class="app-shell">
  <section class="camera-panel">
    <Camera />
  </section>
  <section>
    <h1 style="color: black;">Welcome to the true side of the internet</h1>
  </section>
</main>

<style>
  .app-shell {
    min-height: 100vh;
    padding: 3.5rem clamp(1.5rem, 5vw, 5rem);
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    gap: clamp(2rem, 4vw, 4rem);
    align-items: center;
  }

  .camera-panel {
    display: flex;
    justify-content: center;
  }
</style>
