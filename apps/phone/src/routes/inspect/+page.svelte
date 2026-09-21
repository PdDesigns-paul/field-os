<script lang="ts">
  import { phone } from "$lib/session.svelte";
</script>

<p class="lede">Ticks on this house. {phone.pack.talkName} stays off this Place so it never covers a shutter.</p>

{#if phone.pack.inspect.length === 0}
  <p class="panel">No inspect rows in this pack yet.</p>
{:else}
  <ul class="list">
    {#each phone.pack.inspect as row}
      <li class="list-row">
        <div>
          <strong>{row.title}</strong>
          <p class="caption">{row.body}</p>
        </div>
        <span class="caption">Tick later</span>
      </li>
    {/each}
  </ul>
{/if}
