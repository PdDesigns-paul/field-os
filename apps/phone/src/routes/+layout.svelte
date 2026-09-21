<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Header from "$lib/kit/Header.svelte";
  import PlaceBar from "$lib/kit/PlaceBar.svelte";
  import TalkFab from "$lib/kit/TalkFab.svelte";
  import TalkSheet from "$lib/kit/TalkSheet.svelte";
  import Tour from "$lib/kit/Tour.svelte";
  import { phone } from "$lib/session.svelte";

  let { children } = $props();

  const nested = $derived(
    ["/you", "/settings", "/reference", "/office"].includes($page.url.pathname),
  );
  const title = $derived.by(() => {
    const path = $page.url.pathname;
    if (path === "/today" || path === "/") return phone.pack.places.today;
    if (path === "/door") return phone.pack.places.door;
    if (path === "/inspect") return phone.pack.places.inspect;
    if (path === "/plan") return phone.pack.places.plan;
    if (path === "/you") return "You";
    if (path === "/settings") return "Settings";
    if (path === "/reference") return "Reference";
    if (path === "/office") return "Office";
    return phone.pack.productName;
  });

  onMount(() => {
    void phone.boot();
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js");
    }
  });
</script>

{#if !phone.ready}
  <main class="place"><p class="caption">Opening the book…</p></main>
{:else}
  {#if !phone.tourDone}
    <Tour />
  {/if}
  <main class="place">
    <div class="place-body">
      <Header {title} {nested} />
      {#if phone.closed}
        <p class="banner">The book is closed. This phone is read-only chrome.</p>
      {/if}
      {@render children()}
    </div>
  </main>
  {#if !nested}
    <PlaceBar />
    <TalkFab />
  {/if}
  <TalkSheet />
{/if}
