<script>
  import { createEventDispatcher } from "svelte";
  import Card from "../shared/Card.svelte";
  import Button from "../shared/Button.svelte";
  import axios from "axios";

  const dispatch = createEventDispatcher();
  let user = { username: "", password: "" };
  let errors = { username: "", password: "" };
  let valid = true;
  let userExists = false;
  let somethingWentWrong = false;

  const submitHandler = async () => {
    errors.username = "";
    errors.password = "";
    if (user.username.length < 5) {
      valid = false;
      errors.username = "Username must be longer than 5 characters";
    }
    if (user.password.length < 5) {
      valid = false;
      errors.password = "Password must be longer than 5 characters";
    }
    if (valid) {
      user.username = user.username.trim();
      user.password = user.password.trim();
      const res = await axios({
        method: "post",
        url: `http://localhost:5001/create`,
        data: user,
        withCredentials: false,
      });
      if (res.data.message === "Client already exists") {
        userExists = true;
      } else if (res.data.message === "Client created") {
        dispatch("add");
      } else {
        somethingWentWrong = true;
      }
    }
  };
</script>

<style>
</style>

<div class="mt-10">
  <h1 class="text-xl font-semibold">Sign Up</h1>
  <Card>
    {#if userExists}
      <div class="text-sm font-bold text-red-700">User Already Exists</div>
    {:else if somethingWentWrong}
      <div class="text-sm font-bold text-red-700">Please try again later</div>
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
        <div class="text-sm font-bold text-red-700">{errors.username}</div>
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
        <div class="text-sm font-bold text-red-700">{errors.password}</div>
      </div>
      <Button type="primary" flat={true}>Sign Up</Button>
    </form>
  </Card>
</div>
