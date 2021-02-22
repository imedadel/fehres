<script>
  // import * as memory from "../js/memory.js";
  // import browser from "webextension-polyfill";
  import { fade } from "svelte/transition";
  import { checkIfPaidPaddle, rememberUser } from "../js/lib.js";
  import Info from "./Info.svelte";

  let email = "";
  let checking = false;

  async function handleCheck() {
    checking = true;
    const didPay = await checkIfPaidPaddle(email);

    if (didPay) {
      paidPaddle = "yup";
      await rememberUser(email);
    } else paidPaddle = "nope";
    checking = false;
  }

  let paidPaddle = "dunno";
</script>

<style>

</style>

<div>
  {#if checking}
    <Info message="Checking..." />
  {:else if paidPaddle === 'dunno'}
    <h1 class="font-bold text-2xl mb-4 text-center">Please enter your email</h1>
    <input
      type="email"
      placeholder="example@gmail.com"
      class="shadow appearance-none border rounded w-full py-2 px-3
      text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      bind:value={email} />
    <div class="w-full flex justify-center">
      <button
        class="text-center mx-auto mt-2 bg-blue-500 hover:bg-blue-700 text-white
        font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        on:click={handleCheck}>
        Enter
      </button>
    </div>

    <p class="mt-8 text-lg text-center">
      First time?
      <a
        class="font-bold underline text-blue-500"
        href="https://spacedleet.vercel.app"
        target="_blank">
        Buy SpacedLeet 🧠
      </a>
      .
    </p>
  {:else if paidPaddle === 'yup'}
    <h1 class="text-center font-bold text-2xl" in:fade>
      Sorry for the inconvenience 😊. Please reclick on the extension's icon.
    </h1>
  {:else}
    <h1 class="text-center font-bold text-2xl" in:fade>
      It seems that you didn't buy SpacedLeet. You can buy it on
      <a
        class="text-blue-500 font-bold"
        href="https://spacedleet.vercel.app"
        target="_blank">
        our website
      </a>
      .
    </h1>
    <p class="text-center text-lg" in:fade>
      Is something wrong? Please contact us at
      <a href="mailto:hello@spacedleet.com" target="_blank">
        hello@spacedleet.com
      </a>
    </p>
  {/if}
</div>
