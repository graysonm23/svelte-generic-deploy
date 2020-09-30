<script>
  import { loggedIn } from "../Store/GlobalStore";
</script>

<style>
</style>

<div class="relative mt-10">
  <h1 class="text-xl font-semibold">Home</h1>
  {#if $loggedIn}
    <div>Welcome User</div>
  {:else}
    <div>Please login to access your dashboard</div>
  {/if}
</div>
