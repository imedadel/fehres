<script>
  import { fade } from "svelte/transition";
  import { getDetails, handleBadRating, handleGoodRating } from "../js/lib.js";
  import Info from "./Info.svelte";
  let clickedGood = false;
  let clickedBad = false;
  export let pageType;
</script>

<div>
  {#if !clickedGood && !clickedBad}
    {#await getDetails(pageType === 'problem' ? 'questionTitle' : 'questionExploreTitle')}
      <Info message="Getting the title..." />
    {:then questionTitle}
      <h1 class="text-center text-2xl" in:fade>
        {questionTitle}
        {#if pageType === 'problem'}
          {#await getDetails('questionLevel') then questionLevel}
            <span
              class={`text-white text-xs px-1 ${questionLevel === 'Easy' ? 'bg-green-500' : questionLevel === 'Medium' ? 'bg-orange-500' : 'bg-red-500'}`}>
              {questionLevel}
            </span>
          {/await}
        {/if}
      </h1>
      <div class="mx-auto flex justify-around mt-8">
        <button
          class="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4
          rounded text-2xl inline-flex items-center"
          id="badRating"
          on:click={handleBadRating}
          on:click={() => (clickedBad = true)}>
          <span>Bad</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="ml-2 relative" style="top: .125em"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>
        </button>
        <button
          class="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4
          rounded text-2xl inline-flex items-center"
          id="goodRating"
          on:click={handleGoodRating}
          on:click={() => (clickedGood = true)}>
          <span>Good</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="ml-2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
        </button>
      </div>
    {:catch error}
      <Info message="Something went wrong 😭" />
      <Info message="Please reload the page and try again 🙏" />
    {/await}
  {:else}
    <Info message={clickedGood ? 'Great! 🎉' : "You'll get better 💪"} />
  {/if}
</div>
