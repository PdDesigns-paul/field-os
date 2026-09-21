<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  onMount(() => {
    void goto("/today", { replaceState: true });
  });
</script>

<p class="caption"><a class="go" href="/today">Today</a></p>
