<script>
  // import * as memory from "../js/memory.js";
  // import browser from "webextension-polyfill";
  import { fade } from "svelte/transition";
  import { pageType, checkIfPaidPaddle, lookForUserInfo } from "../js/lib.js";
  import ProblemsCard from "./ProblemsCard.svelte";
  import QuestionCard from "./QuestionCard.svelte";
  import SignUp from "./SignUp.svelte";
  import Info from "./Info.svelte";
</script>

<style>
  :root {
    text-rendering: optimizeLegibility;
    font-family: system-ui;
    font-size: 16px;
    font-weight: 300;
    color: #000;
  }

  main {
    margin: 0 auto;
    width: 40em;
    background-color: #fff;
    padding: 4em;
    overflow-y: auto;
    max-height: 24em;
  }
</style>

<main class="font-sans">
  {#await lookForUserInfo()}
    <Info message="Loading..." />
  {:then userInfo}
    {#if !!userInfo && !!userInfo.email && userInfo.email.length > 0}
      {#await pageType()}
        <Info message="Getting page type..." />
      {:then type}
        {#if type !== 'other'}
          <QuestionCard pageType={type} />
        {:else}
          <ProblemsCard />
        {/if}
      {:catch error}
        <Info message="Something went wrong 😭" />
        <Info message="Please reload the page and try again 🙏" />
      {/await}
    {:else}
      <SignUp />
    {/if}
  {:catch error}
    <Info message="Something went wrong 😭" />
    <Info message="Please reload the page and try again 🙏" />
  {/await}
</main>
