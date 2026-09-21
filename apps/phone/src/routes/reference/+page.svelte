<script lang="ts">
  import { phone } from "$lib/session.svelte";
</script>

<section class="stack">
  {#each phone.pack.help as page}
    <article class="panel">
      <h2>{page.title}</h2>
      <p class="caption">{page.body}</p>
    </article>
  {/each}
  {#if phone.pack.help.length === 0}
    <p class="caption">No help pages in this pack.</p>
  {/if}
</section>
