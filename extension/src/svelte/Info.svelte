<script>
  import { fade } from "svelte/transition";
  export let message;
</script>

<p class="text-xl text-center" in:fade>{message}</p>
