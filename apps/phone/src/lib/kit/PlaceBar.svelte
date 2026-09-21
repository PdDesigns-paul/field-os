<script lang="ts">
  import { page } from "$app/stores";
  import { phone } from "../session.svelte";

  const places = $derived([
    { href: "/today", label: phone.pack.places.today },
    { href: "/door", label: phone.pack.places.door },
    { href: "/inspect", label: phone.pack.places.inspect },
    { href: "/plan", label: phone.pack.places.plan },
  ]);
</script>

<nav class="bar" aria-label="Places">
  {#each places as p}
    <a class="place-tab" href={p.href} aria-current={$page.url.pathname === p.href ? "page" : undefined}>
      {p.label}
    </a>
  {/each}
</nav>

<style>
  .bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: calc(var(--bar) + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    background: var(--paper-2);
    border-top: 1px solid var(--rule);
    z-index: 8;
  }
  .place-tab {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: var(--muted);
    font-weight: 600;
    font-size: 0.92rem;
    min-height: 48px;
  }
  .place-tab[aria-current="page"] {
    color: var(--ink);
  }
</style>
