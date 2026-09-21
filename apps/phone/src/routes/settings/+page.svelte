<script lang="ts">
  import { phone } from "$lib/session.svelte";

  let name = $state("");
  let company = $state("");
  let county = $state("");

  $effect(() => {
    name = phone.owner.name;
    company = phone.owner.company;
    county = phone.owner.county;
  });
</script>

<section class="stack">
  <p class="lede">{phone.pack.copy.setup} No login Place.</p>
  <label class="field">Name<input bind:value={name} /></label>
  <label class="field">Company<input bind:value={company} /></label>
  <label class="field">County<input bind:value={county} /></label>
  <button type="button" class="do" onclick={() => phone.saveSetup({ name, company, county })}>Save</button>
</section>
