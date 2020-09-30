<script>
  import { createEventDispatcher, onMount } from "svelte";
  import Card from "../shared/Card.svelte";
  import Button from "../shared/Button.svelte";
  import axios from "axios";

  let user = { username: "", password: "" };
  let validUser = true;
  let somethingWentWrong = false;

  const dispatch = createEventDispatcher();

  const submitHandler = async () => {
    user.username = user.username.trim();
    user.password = user.password.trim();
    const res = await axios({
      method: "post",
      url: `http://localhost:5001/login`,
      data: user,
      withCredentials: true,
    });
    if (res.data.message === "User does not exist") {
      validUser = false;
    } else if (res.data.message === "User exists") {
      dispatch("login");
    } else {
      somethingWentWrong = true;
    }
  };
</script>

<style>
</style>

<div class="mt-10">
  <h1 class="text-xl font-semibold">Log In</h1>
  <Card>
    {#if somethingWentWrong}
      <div class="text-sm font-bold text-red-700">Please try again later</div>
    {:else if !validUser}
      <div class="text-sm font-bold text-red-700">Incorrect email/password</div>
    {/if}
    <form on:submit|preventDefault={submitHandler}>
      <div class="form-field">
        <label for="username">Username</label>
        <input
          class="bg-white max-w-md mx-auto focus:outline-none
            focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4
            block w-full appearance-none leading-normal"
          type="email"
          bind:value={user.username}
          id="username"
          placeholder="jane@example.com" />
      </div>
      <div class="form-field">
        <label for="password">Password</label>
        <input
          class="bg-white max-w-md mx-auto focus:outline-none
            focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4
            block w-full appearance-none leading-normal"
          type="password"
          bind:value={user.password}
          id="password"
          placeholder="jane@example.com" />
      </div>
      <Button type="secondary" flat={true}>Log In</Button>
    </form>
  </Card>
</div>
