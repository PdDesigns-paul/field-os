<script lang="ts">
  import { phone } from "$lib/session.svelte";
</script>

<section class="stack">
  <p class="kicker">Whose book</p>
  <h2>{phone.owner.label}</h2>
  <p class="caption">{phone.owner.name || "No name yet"} · {phone.owner.company || "No company"} · {phone.owner.county || "No county"}</p>
  <div class="panel">
    <p><strong>Book health</strong></p>
    <p class="caption">Engine: {phone.engine}</p>
    <p class="caption">Last write: {phone.lastWrite ?? "none this session"}</p>
    <p class="caption">Pack: {phone.pack.id}</p>
    {#if phone.closed}
      <p class="caption">Book closed — chrome only.</p>
    {/if}
  </div>
</section>
