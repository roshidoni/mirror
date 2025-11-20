<script lang="ts">
  import {
    Camera as CameraIcon,
    CameraOff,
    Flashlight,
    Info,
    X,
  } from "@lucide/svelte";
  import { onDestroy } from "svelte";
  import { captureAndSaveFrame } from "./utils";

  let errorMsg = "";
  let sourceObject: HTMLVideoElement | null = null;
  let activeStream: MediaStream | null = null;
  let isStreaming = false;
  let requesting = false;
  let liarMode = false;
  let flashlightOn = false;
  let showInfoModal = false;

  export let onFlashlightToggle: (active: boolean) => void = () => {};

  $: buttonLabel = requesting
    ? "Requesting..."
    : isStreaming
      ? "Turn Off Camera"
      : "Access Camera";

  async function requestCameraAccess() {
    if (requesting) return;

    try {
      requesting = true;
      errorMsg = "";

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        errorMsg = "Camera access is not supported in this browser.";
        return;
      }

      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
        activeStream = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 4096 },
          height: { ideal: 2160 },
        },
      });

      if (sourceObject) {
        sourceObject.srcObject = stream;
        activeStream = stream;
        isStreaming = true;
      }
    } catch (error) {
      isStreaming = false;

      if (error instanceof DOMException && error.name === "NotAllowedError") {
        errorMsg =
          "Camera permission is blocked. Enable it from browser settings.";
      } else {
        errorMsg = "Unable to access the camera. Please check permissions.";
      }
    } finally {
      requesting = false;
    }
  }

  function toggleMirror() {
    liarMode = !liarMode;
  }

  function stopCamera() {
    if (activeStream) {
      activeStream.getTracks().forEach((track) => track.stop());
      activeStream = null;
    }

    if (sourceObject) {
      sourceObject.srcObject = null;
    }

    isStreaming = false;
  }

  function handleCameraButton() {
    if (requesting) {
      return;
    }

    if (isStreaming) {
      stopCamera();
    } else {
      requestCameraAccess();
    }
  }

  function saveVideoFrame() {
    if (!sourceObject || !isStreaming) {
      return;
    }
    captureAndSaveFrame(sourceObject, liarMode);
  }
  onDestroy(() => {
    stopCamera();
  });

  function toggleFlashlight() {
    flashlightOn = !flashlightOn;
    onFlashlightToggle?.(flashlightOn);
  }

  function toggleInfoModal() {
    showInfoModal = !showInfoModal;
  }
</script>

<div
  class="camera-root"
  data-streaming={isStreaming}
  data-flashlight={flashlightOn}
>
  <div class="camera-status-bar">
    <div class="status-left">
      <span class:live={isStreaming} class="status-indicator" aria-hidden="true"
      ></span>
      {isStreaming ? "Live preview" : "Standby"}
    </div>
    <span class="status-brand">{liarMode ? "Liar Mirror" : "True Mirror"}</span>
  </div>

  <video
    class="camera-video"
    class:mirrored={liarMode}
    bind:this={sourceObject}
    autoplay
    playsinline
    muted
  >
    <track kind="captions" />
  </video>

  {#if errorMsg}
    <div class="camera-error" role="status" aria-live="polite">
      {errorMsg}
    </div>
  {/if}

  <div class="camera-controls">
    <button
      class="info-button"
      type="button"
      aria-label="Camera Info"
      on:click={toggleInfoModal}
    >
      <Info size={20} strokeWidth={2} />
    </button>

    <div class="control-row">
      <div class="control-slot control-left">
        <div class="left-controls">
          <button
            class="camera-button circle-button"
            type="button"
            aria-label={buttonLabel}
            title={buttonLabel}
            on:click={handleCameraButton}
            disabled={requesting}
          >
            {#if isStreaming}
              <CameraIcon size={28} strokeWidth={1.6} aria-hidden="true" />
            {:else}
              <CameraOff size={28} strokeWidth={1.6} aria-hidden="true" />
            {/if}
          </button>

          <button
            class="icon-button circle-button"
            type="button"
            aria-label="Toggle flashlight"
            title="Toggle flashlight"
            data-active={flashlightOn}
            on:click={toggleFlashlight}
          >
            <Flashlight size={26} strokeWidth={1.6} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div class="control-slot control-center">
        {#if isStreaming}
          <button
            class="capture-button circle-button"
            type="button"
            on:click={saveVideoFrame}
            aria-label="Take a picture"
            title="Take a picture"
          ></button>
        {/if}
      </div>

      <div class="control-slot control-right">
        <div class="mirror-toggle">
          <span class="toggle-text">Liar mode</span>
          <div
            class="toggle-switch"
            aria-checked={liarMode}
            data-state={liarMode ? "on" : "off"}
            on:click={toggleMirror}
          >
            <div class="toggle-thumb"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

{#if showInfoModal}
  <div class="modal-backdrop" on:click={toggleInfoModal} role="presentation">
    <div
      class="modal-content"
      on:click|stopPropagation
      role="dialog"
      aria-modal="true"
    >
      <button
        class="close-button"
        on:click={toggleInfoModal}
        aria-label="Close info"
      >
        <X size={24} />
      </button>

      <h2>Camera Features</h2>

      <div class="feature-list">
        <div class="feature-item">
          <div class="feature-icon">
            <CameraIcon size={24} />
          </div>
          <div class="feature-text">
            <h3>True Mirror</h3>
            <p>
              See yourself as others see you. Non-reversed video feed that shows
              your true appearance.
            </p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">
            <CameraOff size={24} />
          </div>
          <div class="feature-text">
            <h3>Liar Mirror</h3>
            <p>
              The traditional mirror view you're used to. Reversed reflection
              that comforts your brain.
            </p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">
            <Flashlight size={24} />
          </div>
          <div class="feature-text">
            <h3>Screen Flash</h3>
            <p>
              Illuminates your face using the screen brightness for better
              lighting in dark environments.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .camera-root {
    position: relative;
    width: 100%;
    max-width: 820px;
    aspect-ratio: 16 / 9;
    border-radius: 24px;
    overflow: hidden;
    /* background: #030306; */
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 25px 75px rgba(5, 5, 10, 0.65);
  }

  .camera-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: #000;
    filter: saturate(1.05) contrast(1.05);
    transition: transform 500ms ease-in;
  }

  .camera-video.mirrored {
    transform: scaleX(-1);
  }

  .camera-status-bar {
    position: absolute;
    top: 1.4rem;
    left: 1.5rem;
    right: 1.5rem;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: rgba(255, 255, 255, 0.75);
  }

  .status-left {
    display: flex;
    align-items: center;
    gap: 0.45rem;
  }

  .status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 0 0 rgba(255, 59, 106, 0);
    transition:
      background 150ms ease,
      box-shadow 150ms ease;
  }

  .status-indicator.live {
    background: #ff3b6a;
    box-shadow: 0 0 12px rgba(255, 59, 106, 0.7);
  }

  .status-brand {
    font-weight: 600;
  }

  .camera-error {
    position: absolute;
    top: 0.75rem;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 2.5rem);
    padding: 0.85rem 1rem;
    background: rgba(17, 17, 24, 0.85);
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    font-size: 0.85rem;
    color: #ffc7d6;
    text-align: center;
    z-index: 3;
    backdrop-filter: blur(14px);
  }

  .camera-controls {
    position: absolute;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 3rem);
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    align-items: center;
    z-index: 2;
  }

  .control-row {
    display: flex;
    gap: 0.75rem;
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .control-slot {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .left-controls {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
  }

  .control-left {
    justify-content: flex-start;
  }

  .control-center {
    justify-content: center;
  }

  .control-right {
    justify-content: flex-end;
  }

  .circle-button {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .icon-button {
    background: rgba(34, 34, 36, 0.75);
    color: #fff;
    cursor: pointer;
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.12),
      0 8px 20px rgba(0, 0, 0, 0.45);
    transition:
      transform 120ms ease,
      box-shadow 120ms ease,
      background 120ms ease;
  }

  .icon-button:hover,
  .icon-button:focus-visible {
    transform: translateY(-2px);
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.18),
      0 12px 28px rgba(0, 0, 0, 0.6);
  }

  .icon-button[data-active="true"] {
    background: linear-gradient(130deg, #ffe066, #ffb347);
    color: #1a1a1a;
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.25),
      0 12px 28px rgba(255, 179, 71, 0.45);
  }

  .capture-button {
    border: 3px solid rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.1);
    box-shadow:
      0 0 0 2px rgba(0, 0, 0, 0.6),
      0 6px 14px rgba(0, 0, 0, 0.7);
    cursor: pointer;
    position: relative;
    transition:
      transform 120ms ease,
      box-shadow 120ms ease,
      background 120ms ease;
  }

  .capture-button::after {
    content: "";
    position: absolute;
    inset: 7px;
    border-radius: 50%;
    background: #ffffff;
    transition:
      transform 120ms ease,
      background 120ms ease;
  }

  .capture-button:hover,
  .capture-button:focus-visible {
    transform: translateY(-1px);
    box-shadow:
      0 0 0 2px rgba(0, 0, 0, 0.7),
      0 8px 18px rgba(0, 0, 0, 0.85);
  }

  .capture-button:active::after {
    transform: scale(0.94);
    background: #f0f0f0;
  }

  .camera-button {
    cursor: pointer;
    color: #fff;
    transition:
      transform 120ms ease,
      box-shadow 120ms ease,
      opacity 120ms ease,
      background 120ms ease;
    background: radial-gradient(
        circle at 30% 30%,
        rgba(255, 255, 255, 0.2),
        rgba(255, 255, 255, 0)
      )
      rgba(34, 34, 36, 0.8);
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.16),
      0 10px 25px rgba(0, 0, 0, 0.6);
  }

  .camera-button:hover,
  .camera-button:focus-visible {
    transform: translateY(-2px);
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.25),
      0 14px 30px rgba(0, 0, 0, 0.7);
  }

  .camera-button:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.12),
      0 6px 18px rgba(0, 0, 0, 0.45);
  }

  .mirror-toggle {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.6rem 1rem;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  .toggle-text {
    font-size: 0.8rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.78);
  }

  .toggle-switch {
    display: inline-flex;
    position: relative;
    align-items: center;
    width: 46px;
    height: 24px;
    gap: 0.6rem;
    border: none;
    color: #fff;
    font-size: 0.85rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 160ms ease;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    padding: 0;
  }

  .toggle-thumb {
    width: 25px;
    height: 18px;
    background: #fff;
    position: absolute;
    border-radius: 12px;
    top: 50%;
    left: 3px;
    transform: translate(0, -50%);
    transition:
      transform 160ms ease,
      background 160ms ease;
  }

  .toggle-switch[data-state="on"] {
    background: linear-gradient(120deg, #ff6b8f, #ff2d55);
  }

  .toggle-switch[data-state="on"] .toggle-thumb {
    transform: translate(15px, -50%);
  }

  @media (max-width: 768px) {
    .camera-root {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      max-width: none;
      border-radius: 0;
      box-shadow: none;
      border: none;
      z-index: 10;
    }

    .camera-controls {
      bottom: 2.4rem;
      width: calc(100% - 2rem);
    }

    .control-row {
      flex-direction: row;
      align-items: center;
      gap: 0.9rem;
      flex-wrap: wrap;
    }

    .control-slot {
      flex: 1 1 30%;
      justify-content: center;
    }

    .mirror-toggle {
      justify-content: space-between;
      width: 100%;
    }

    .camera-status-bar {
      top: 2rem;
    }

    .camera-root[data-flashlight="true"]::after {
      content: "";
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100vh;
      background: rgba(255, 255, 255, 0.9);
      animation: flashlight 2s infinite;
      z-index: 20;
      pointer-events: none;
    }
  }

  .info-button {
    position: absolute;
    top: -3.5rem;
    right: 0;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.6);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 5;
  }

  .info-button:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
  }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    animation: fade-in 0.2s ease-out;
  }

  .modal-content {
    background: #1a1a1a;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    padding: 2rem;
    width: 100%;
    max-width: 480px;
    position: relative;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .close-button {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-button:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  .modal-content h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 2rem 0;
    color: #fff;
  }

  .feature-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .feature-item {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  .feature-icon {
    background: rgba(255, 255, 255, 0.05);
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ff3b6a;
    flex-shrink: 0;
  }

  .feature-text h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #fff;
  }

  .feature-text p {
    margin: 0;
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.5;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
</style>
