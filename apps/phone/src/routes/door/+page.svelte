<script lang="ts">
  import { phone } from "$lib/session.svelte";

  const card = $derived(phone.pack.cards[phone.cardIndex] ?? phone.pack.cards[0]);
</script>

<p class="kicker">Compass</p>
<p class="lede">{phone.pack.who}</p>

{#if card}
  <article class="panel stack">
    <p class="kicker">Card</p>
    <h2>{card.title}</h2>
    <p>{card.hook}</p>
    {#if card.reason}
      <p class="caption">{card.reason}</p>
    {/if}
    {#if card.question}
      <p><strong>{card.question}</strong></p>
    {/if}
  </article>
{:else}
  <p class="panel">Door cards compile from the pack. This book is still a skeleton.</p>
{/if}

<div class="row" style="margin-top:14px">
  {#each phone.pack.cards as c, i}
    <button
      type="button"
      class="chip"
      aria-pressed={phone.cardIndex === i}
      onclick={() => (phone.cardIndex = i)}
    >
      {c.title}
    </button>
  {/each}
</div>
