<script>
  import { loggedIn } from "./Store/GlobalStore";
  import Header from "./components/Header.svelte";
  import Home from "./components/Home.svelte";
  import LogIn from "./components/LogIn.svelte";
  import SignUp from "./components/SignUp.svelte";
  import { onDestroy, onMount } from "svelte";
  import axios from "axios";
  let userLoggedIn;
  let LoggedInmenu = ["Home"];
  let LoggedOutMenu = ["Home", "Log In", "Sign Up"];
  let menu;
  let activeTab = "Home";
  let proxy = "CORS_URL_PROXY";

  $: userLoggedIn ? (menu = LoggedInmenu) : (menu = LoggedOutMenu);

  const unsubscribe = loggedIn.subscribe((value) => {
    userLoggedIn = value;
  });

  const changeTabs = (e) => {
    activeTab = e.detail;
  };
  const handleAdd = () => {
    activeTab = "Log In";
  };
  const handleLogin = () => {
    loggedIn.update((value) => (value = true));
    //$ denotes that the user is subscribing and unscubscribing without having to call unsibscribe();
    userLoggedIn = $loggedIn;
    activeTab = "Home";
  };
  const handleLogout = () => {
    loggedIn.update((value) => (value = false));
    userLoggedIn = $loggedIn;
    activeTab = "Log In";
  };

  onMount(async () => {
    const res = await axios({
      method: "get",
      url: proxy + `https://svelte-new-vercel.vercel.app:5001/user`,
    });
    if (res.data.message) {
      loggedIn.update((value) => (value = true));
      userLoggedIn = $loggedIn;
    }
  });

  onDestroy(() => {
    //always unsibscribe from store to avoid memory leaks
    unsubscribe();
  });
</script>

<style>
</style>

<main class="text-center p-4 max-w-full m-0 m-auto">
  <Header {userLoggedIn} on:tabChange={changeTabs} {menu} />
  {#if activeTab === 'Home'}
    <Home on:logout={handleLogout} />
  {:else if activeTab === 'Log In'}
    <LogIn {proxy} on:login={handleLogin} />
  {:else if activeTab === 'Sign Up'}
    <SignUp {proxy} on:add={handleAdd} />
  {/if}
</main>
