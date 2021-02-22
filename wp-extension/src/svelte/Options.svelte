<script>
  import { getHistory, setHistory } from "../js/lib.js";
  import { saveAs } from "file-saver";

  async function saveHistory() {
    const userHistory = await getHistory();
    saveAs(
      new Blob([JSON.stringify(userHistory)], { type: "application/json" }),
      `spacedleet-export-${Date.now()}.json`
    );
  }

  let fileUpload;

  function handleFileUpload() {
    if (!!fileUpload) {
      fileUpload.click();
    }
  }

  async function importHistory(event) {
    if (event.target.files.length > 0) {
      if (event.target.files[0].type !== "application/json") {
        alert("Please select a .JSON file");
      } else {
        try {
          const parsedHistory = JSON.parse(await event.target.files[0].text());
          await setHistory(parsedHistory);
        } catch (error) {
          alert(
            "Something went wrong. Please try again. Make sure to select a .JSON file."
          );
        }
      }
    } else {
      alert("No file selected.");
    }
  }
</script>

<style>
  :root {
    text-rendering: optimizeLegibility;
    font-family: system-ui;
    font-size: calc(0.5vw + 0.5vmin + 16px);
    line-height: 1.5;
    font-weight: 300;
    color: #000;
  }

  main {
    margin: 0 auto;
    max-width: 40rem;
    background-color: #fff;
    overflow-y: auto;
    font-weight: 300;
  }
</style>

<main>
  <h1 class="text-3xl my-2">Options — SpacedLeet</h1>
  <h2 class="text-2xl mb-2">Import and Export</h2>
  <p class="text-lg mb-8">
    You can export your full reviews history and import them, on this page.
  </p>
  <div class="flex justify-around">
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4
      rounded text-2xl"
      on:click={saveHistory}>
      Export
    </button>
    <div>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4
        rounded text-2xl"
        on:click={handleFileUpload}>
        Import
      </button>
      <input
        type="file"
        accept=".json"
        class="hidden"
        bind:this={fileUpload}
        on:change={importHistory} />
    </div>
  </div>
</main>
