<script>
  import { fade } from "svelte/transition";
  import { getProblemsList, getExploreList } from "../js/lib.js";
</script>

<div>
  <h2 class="text-center text-2xl mt-2 mb-4" in:fade>Problems Section</h2>
  <ul class="list-disc font-normal mb-8">
    {#await getProblemsList() then problemsList}
      {#if problemsList.length > 0}
        {#each problemsList as [problemId, problemDetails]}
          <li class="mb-2" in:fade>
            <a href={problemDetails.link} target="_blank">
              <span
                class={`text-white mr-1 text-xs px-1 ${problemDetails.level === 'Easy' ? 'bg-green-500' : problemDetails.level === 'Medium' ? 'bg-orange-500' : 'bg-red-500'}`}>
                {problemDetails.level}
              </span>
              {problemId} {problemDetails.title}
            </a>
          </li>
        {/each}
      {:else}
        <li class="font-bold" in:fade>No problems for today 😊</li>
      {/if}
    {/await}
  </ul>
  <h2 class="text-center text-2xl mt-2" in:fade>Explore Section</h2>
  <ul class="list-disc font-normal mb-0">
    {#await getExploreList() then exploreList}
      {#if exploreList.length > 0}
        {#each exploreList as [exploreId, exploreDetails]}
          <li class="mb-2" in:fade>
            <a href={exploreDetails.link} target="_blank">
              {exploreDetails.title.trim()}
            </a>
          </li>
        {/each}
      {:else}
        <li class="font-bold" in:fade>No explore cards for today 😊</li>
      {/if}
    {/await}
  </ul>
</div>
