<script lang="ts">
  let errorMsg = "";
  let sourceObject: HTMLVideoElement | null;
  async function requestCameraAccess() {
    try {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            width: { ideal: 4096 },
            height: { ideal: 2160 },
          },
        })
        .then((steam) => {
          console.log(steam, sourceObject);
          if (sourceObject !== null) {
            console.log("worked");
            sourceObject.srcObject = steam;
          }
        });
    } catch (error) {
      if (error) {
        alert(error);
      }
    }
  }
</script>

<div>
  <video class="camera-container" bind:this={sourceObject} autoplay>
    <track kind="captions" />
  </video>
  <h1>{errorMsg}</h1>
  <button on:click={requestCameraAccess}>Access Video</button>
</div>

<style>
  /* .camera-container {
    width: auto;
    height: auto;
    border: 2px solid #ccc;
    border-radius: 8px;
    font-size: 1.5em;
    color: #333;
  } */
</style>
