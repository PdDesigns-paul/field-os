<script lang="ts">
  import { phone } from "$lib/session.svelte";

  let address = $state("");
</script>

{#if phone.pins.length === 0}
  <p class="lede">No pins yet. Plan is a list. The map is a luxury.</p>
{:else}
  <ul class="list">
    {#each phone.pins as pin}
      <li class="list-row">
        <div>
          <strong>{pin.address || "Unnamed house"}</strong>
          <p class="caption">{pin.status ?? "open"}</p>
        </div>
      </li>
    {/each}
  </ul>
{/if}

<div class="stack" style="margin-top:16px">
  <label class="field">Address<input bind:value={address} placeholder="12 Oak" /></label>
  <button
    type="button"
    class="do"
    onclick={async () => {
      await phone.dropPin(address.trim());
      address = "";
    }}>{phone.pack.copy.pin}</button
  >
</div>
