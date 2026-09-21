<script lang="ts">
  import { phone } from "../session.svelte";

  const modes = [
    { id: "live" as const, label: "Live" },
    { id: "roleplay" as const, label: "Roleplay" },
    { id: "mindset" as const, label: "Mindset" },
  ];
</script>

{#if phone.talkOpen}
  <div class="sheet" role="dialog" aria-label={phone.pack.talkName}>
    <div class="sheet-card">
      <div class="row">
        {#each modes as m}
          <button
            type="button"
            class="chip"
            aria-pressed={phone.talkMode === m.id}
            onclick={() => (phone.talkMode = m.id)}
          >
            {m.label}
          </button>
        {/each}
      </div>
      <p class="lede">{phone.pack.briefs[phone.talkMode]}</p>
      <p class="caption">Coach needs a key — later.</p>
      <div class="row">
        <button type="button" class="do" disabled>Send</button>
        <button type="button" class="do ghost" onclick={() => phone.closeTalk()}>Close</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .sheet {
    position: fixed;
    inset: 0;
    background: color-mix(in oklab, var(--ink) 28%, transparent);
    display: flex;
    align-items: flex-end;
    z-index: 12;
    padding: 16px 16px calc(16px + env(safe-area-inset-bottom));
  }
  .sheet-card {
    width: min(42rem, 100%);
    margin: 0 auto;
    background: var(--paper);
    border-radius: 22px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
</style>
