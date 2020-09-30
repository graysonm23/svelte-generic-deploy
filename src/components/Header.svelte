<script>
  import { loggedIn } from "../Store/GlobalStore";
  import { createEventDispatcher } from "svelte";
  import axios from "axios";

  export let userLoggedIn;
  export let menu;

  const dispatch = createEventDispatcher();

  const handleLogout = async () => {
    const response = axios({
      method: "get",
      url: "http://localhost:5001/logout",
      withCredentials: true,
    });
    loggedIn.update((value) => (value = false));
  };
</script>

<style>
</style>

<header class="h-20 bg-gray-200 flex justify-between">
  <div>
    <ul class="flex p-3 m-2">
      {#each menu as item}
        <li
          class="m-2 cursor-pointer"
          on:click={() => dispatch('tabChange', item)}>
          {item}
        </li>
      {/each}
    </ul>
  </div>
  {#if userLoggedIn}
    <div class="flex flex-row justify-end">
      <button
        on:click={handleLogout}
        class="hover:underline text-blue-500 text-lg m-2">Log Out</button>
      <button class="w-20">
        <img
          class="h-full inline"
          src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
          alt="user profile" />
      </button>
    </div>
  {/if}
</header>
