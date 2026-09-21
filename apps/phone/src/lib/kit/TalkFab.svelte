<script lang="ts">
  import { page } from "$app/stores";
  import { phone } from "../session.svelte";

  const hidden = $derived($page.url.pathname.startsWith("/inspect"));
</script>

{#if !hidden}
  <button type="button" class="talk fab" onclick={() => phone.openTalk()}>
    {phone.pack.talkName}
  </button>
{/if}

<style>
  .fab {
    position: fixed;
    right: max(16px, env(safe-area-inset-right));
    bottom: calc(var(--bar) + 18px + env(safe-area-inset-bottom));
    z-index: 9;
    box-shadow: 0 8px 24px color-mix(in oklab, var(--ink) 18%, transparent);
  }
</style>
