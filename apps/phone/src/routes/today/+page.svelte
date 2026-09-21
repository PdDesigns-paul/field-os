<script lang="ts">
  import { phone } from "$lib/session.svelte";
  import { formatDay, formatElapsed } from "$lib/dates";

  let name = $state("");
  let company = $state("");
  let county = $state("");

  $effect(() => {
    name = phone.owner.name;
    company = phone.owner.company;
    county = phone.owner.county;
  });

  async function save() {
    await phone.saveSetup({ name: name.trim(), company: company.trim(), county: county.trim() });
  }
</script>

<p class="kicker">{formatDay(phone.day?.startedAt)}</p>
<p class="caption">{phone.owner.label}</p>

{#if !phone.setupDone}
  <section class="stack" style="margin-top:16px">
    <p class="banner">{phone.pack.copy.setup}</p>
    <label class="field">Name<input bind:value={name} autocomplete="name" /></label>
    <label class="field">Company<input bind:value={company} /></label>
    <label class="field">County<input bind:value={county} /></label>
    <button type="button" class="do" onclick={save}>Save this phone</button>
  </section>
{:else}
  <section class="stack" style="margin-top:18px">
    <div class="tiles">
      {#each phone.pack.labor.units as unit}
        <button type="button" class="tile" onclick={() => phone.bump(unit.id)}>
          <strong>{phone.day?.counts[unit.id] ?? 0}</strong>
          <span>{unit.label}</span>
        </button>
      {/each}
    </div>
    <p class="caption">
      {#if phone.day}
        {phone.paused ? "Paused" : "On the street"} · {formatElapsed(phone.elapsed)}
      {:else}
        No day open.
      {/if}
    </p>
    <div class="row">
      {#if !phone.day}
        <button type="button" class="do" onclick={() => phone.startDay()}>{phone.pack.copy.start}</button>
      {:else}
        <button type="button" class="do ghost" onclick={() => phone.pauseDay()}>
          {phone.paused ? "Resume" : "Pause"}
        </button>
        <button type="button" class="do ghost" onclick={() => phone.endDay()}>{phone.pack.copy.end}</button>
      {/if}
    </div>
  </section>
{/if}
