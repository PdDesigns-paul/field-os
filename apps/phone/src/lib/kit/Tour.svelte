<script lang="ts">
  import { phone } from "../session.svelte";

  let i = $state(0);

  const slides = $derived([
    { title: "Who I am", body: phone.pack.who },
    { title: "Drop a pin", body: "When a house matters, pin it. Plan is the list of pins you dropped." },
    { title: "At the door", body: "Hook, honest reason, one open question. Leave on a no." },
    { title: "Talk", body: `${phone.pack.talkName} is a button, not a tab. Live, Roleplay, Mindset.` },
    { title: "Why we stop", body: "The honest reason is the street you are already on. Do not invent the rest." },
  ]);

  async function skip() {
    await phone.finishTour();
  }

  async function next() {
    if (i >= slides.length - 1) {
      await skip();
      return;
    }
    i += 1;
  }
</script>

<div class="tour" role="dialog" aria-label="Tour">
  <p class="kicker">{i + 1} / {slides.length}</p>
  <h2>{slides[i].title}</h2>
  <p class="lede">{slides[i].body}</p>
  <div class="row">
    <button type="button" class="do" onclick={next}>{i === slides.length - 1 ? "Start" : "Next"}</button>
    <button type="button" class="do ghost" onclick={skip}>Skip</button>
  </div>
</div>

<style>
  .tour {
    position: fixed;
    inset: 0;
    background: var(--paper);
    z-index: 20;
    padding: 48px var(--pad) 32px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 8px;
  }
  h2 {
    font-size: 2rem;
    max-width: 12ch;
  }
</style>
