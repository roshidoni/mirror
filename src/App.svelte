<script lang="ts">
  import Camera from "./lib/Camera.svelte";

  let isFlashlightOn = false;

  function handleFlashlight(active: boolean) {
    isFlashlightOn = active;
  }
</script>

<div class="app-background" class:flashlight-active={isFlashlightOn}>
  <main class="app-shell">
    <section class="camera-panel">
      <Camera onFlashlightToggle={handleFlashlight} />
    </section>
    <section class="intro-section">
      <h1>
        Welcome to the <span class="highlight">True side</span> of the Internet
      </h1>
      <p class="privacy-note">
        Your privacy matters. This website <span class="highlight-red"
          >does not</span
        > collect or store any data from your camera. Everything happens locally
        in your browser.
      </p>
    </section>
  </main>
</div>

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

  h1 {
    color: var(--text-color);
    font-size: clamp(2rem, 5vw, 3.5rem);
    line-height: 1.1;
    font-weight: 800;
    margin-bottom: 1.5rem;
    letter-spacing: -0.02em;
  }

  .highlight {
    color: #fff;
    background: linear-gradient(120deg, #ff3b6a, #ff9068);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .highlight-red {
    color: #ff3b6a;
    font-weight: 600;
  }

  .privacy-note {
    color: var(--text-color);
    opacity: 0.7;
    font-size: 1.1rem;
    line-height: 1.6;
    max-width: 600px;
  }

  .intro-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: opacity 0.3s ease;
  }

  .app-background.flashlight-active .intro-section {
    opacity: 0;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    .intro-section {
      display: none;
    }
  }
</style>
