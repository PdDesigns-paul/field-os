<script lang="ts">
  import { phone } from "../session.svelte";

  let { title, nested = false }: { title: string; nested?: boolean } = $props();
</script>

<header class="hdr">
  {#if nested}
    <a class="go" href="/today">Back</a>
  {:else}
    <span class="mark">{phone.pack.productName}</span>
  {/if}
  <h1>{title}</h1>
  <div class="tools">
    <a class="go" href="/reference">Help</a>
    <button type="button" class="go" onclick={() => (phone.menuOpen = !phone.menuOpen)}>Menu</button>
  </div>
</header>

{#if phone.menuOpen}
  <nav class="menu" aria-label="Menu">
    <a class="go" href="/you" onclick={() => (phone.menuOpen = false)}>You</a>
    <a class="go" href="/settings" onclick={() => (phone.menuOpen = false)}>Settings</a>
    <a class="go" href="/reference" onclick={() => (phone.menuOpen = false)}>Reference</a>
  </nav>
{/if}

<style>
  .hdr {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 8px;
    min-height: 48px;
    margin-bottom: 18px;
  }
  .hdr h1 {
    font-size: 1.2rem;
    text-align: center;
  }
  .mark {
    font-weight: 600;
    font-size: 0.92rem;
  }
  .tools {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
  .menu {
    display: flex;
    gap: 16px;
    padding: 4px 0 16px;
    border-bottom: 1px solid var(--rule);
    margin-bottom: 16px;
  }
</style>
