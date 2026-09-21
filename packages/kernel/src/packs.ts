import { compileMeta } from "./compile.ts";
import type { BrandPack } from "./types.ts";

const field = compileMeta(
  {
    id: "field",
    productName: "Field",
    talkName: "Talk",
    units: [
      { id: "doors", label: "Doors" },
      { id: "talks", label: "Talks" },
      { id: "sets", label: "Sets" },
    ],
    who: "I am a new hire. I say who I am, the honest reason I stopped, and one open question.",
    starters: ["What do I say first?", "How do I leave on a no?"],
    help: [{ title: "Leave", body: "When they say no, thank them and leave. Do not pile on." }],
    reference: [
      {
        title: "Who I am",
        analog: "Taggart D2DU (public teaching)",
        body: "Name, company, honest reason. Distilled here — not a licensed dump. The porch hears a person, not a pitch.",
      },
      {
        title: "Leave on a no",
        analog: "Bensman / Bryant porch craft (public)",
        body: "A no is a complete sentence. Thank them and go. One set appointment can still be a winning day.",
      },
      {
        title: "Cooling-off",
        analog: "16 CFR 429",
        body: "Three business days to cancel a home sale of $25 or more. The state may give more. Never coach a waiver.",
      },
    ],
  },
  {
    cards: `## Who I am
Hi, I am with the company on my badge. I only stopped because I am walking this street today.

I am not here to dump a pitch. I wanted to see if this house wants one short question.

Is now a bad time for one question, or should I keep walking?

## Honest reason
I only stopped because I am on this street today. That is the whole reason.

If this is a no, I will thank you and go.

What would make this a bad time?

## Leave
Thank you. I will leave it there.

A no is a complete sentence.

May I leave you in peace?`,
    inspect: `## Mailbox name
Name on the mailbox

## Who answered
Who came to the door

## Follow up
Follow-up note`,
    briefs: `## live
Stay short. Hook, honest reason, one question. Leave on a no.

## roleplay
Score the line. Did they say who they are and ask one question? Did they leave on a no?

## mindset
Pace the day. One set appointment can be a winning day.`,
  },
);

const pest = compileMeta(
  {
    id: "pest",
    productName: "Pest route",
    talkName: "Talk",
    pwa: { name: "Pest route", shortName: "Pest" },
    units: [
      { id: "stops", label: "Stops" },
      { id: "inspects", label: "Inspects" },
      { id: "starts", label: "Starts" },
    ],
    who: "I walk a route. I look at the foundation line. I do not invent an infestation.",
    starters: ["What do I say at a stop?", "When do I leave?"],
    help: [{ title: "Leave", body: "Four questions, then leave. Do not invent a chemical." }],
    reference: [
      {
        title: "Foundation line",
        analog: "NPMA / EPA Core (public)",
        body: "Look at what you both can see along the slab. Do not invent activity next door. The label is the law — do not name a chemical you did not bring.",
      },
    ],
  },
  {
    cards: `## Stop
Hi, I am on this street today checking foundation lines for the houses that asked.

I am not selling a spray from the sidewalk. I wanted to see if this house wants a look at the foundation.

Has anyone in the house been dealing with activity along the foundation this season?

## Inspect
If they invite a look, stay on the foundation line. Name what you both can see.

Do not invent activity next door.

What do you already see along that line?

## Start
A start is a scheduled service they asked for. Not a sidewalk close.

If it is a no, thank them and leave.

Should I leave a card, or leave you be?`,
    inspect: `## Foundation
Foundation line

## Moisture
Moisture at the slab

## Entry
Entry gaps`,
    briefs: `## live
Stops, inspects, starts. Foundation language. Never invent an infestation or a chemical.

## roleplay
Did they look at the foundation? Did they invent activity next door?

## mindset
One start can be a winning day. Pace the route.`,
  },
);

const solar = compileMeta(
  {
    id: "solar",
    productName: "Solar route",
    talkName: "Talk",
    pwa: { name: "Solar route", shortName: "Solar" },
    units: [
      { id: "pitch", label: "Pitch" },
      { id: "site", label: "Site" },
      { id: "route", label: "Route" },
    ],
    who: "I qualify, then I leave. I never invent a kWh number or a credit year.",
    starters: ["What are the four qualifiers?", "How do I leave?"],
    help: [
      {
        title: "Qualifiers",
        body: "Own the home, pay the bill, have a usable plane, and want a look. Any no, leave. Do not invent a bill or a credit.",
      },
    ],
    reference: [
      {
        title: "Four then leave",
        analog: "NABCEP / SEI (public)",
        body: "Own the home, pay the bill, open plane, want a look. Any no, leave. Never the utility. Never invent a production number or a credit year.",
      },
    ],
  },
  {
    cards: `## Pitch
Hi, I am walking this street asking four short qualifiers. If it is not a fit I leave.

I do not invent production numbers. I do not claim to be the power company.

Do you own the home, and do you pay the electric bill?

## Site
I only talk about a site after they invite a look.

Four qualifiers, then leave. Do not stack a second pitch.

Is there an open plane on the house they already know about?

## Leave
If any qualifier is a no, thank them and leave.

A no is the end of the stop.

May I leave you in peace?`,
    inspect: `## Facing
Facing and shade

## Panel space
Open plane on the house

## Service
Service panel access`,
    briefs: `## live
Pitch, site, route. Four qualifiers, then leave. Never invent kWh or a credit year.

## roleplay
Did they leave on a no? Did they claim to be the power company?

## mindset
One set site can be a winning day. Do not invent a neighbor who just signed.`,
  },
);

const roof = compileMeta(
  {
    id: "roof",
    productName: "Roof canvass",
    talkName: "Talk",
    pwa: { name: "Roof canvass", shortName: "Roof" },
    modules: { storms: true, claim: true },
    units: [
      { id: "doors", label: "Doors" },
      { id: "looks", label: "Looks" },
      { id: "sets", label: "Sets" },
    ],
    statusToUnit: {
      "no-answer": "doors",
      talked: "doors",
      look: "looks",
      set: "sets",
      revisit: null,
      skip: null,
    },
    who: "I canvass after weather. Script B first. i35 only after they already named what they saw.",
    starters: ["What is Script B?", "When do I run i35?"],
    help: [
      {
        title: "Script B",
        body: "Age and a free look. Script A only after Keep on a matching zip.",
      },
    ],
    reference: [
      {
        title: "What you both can see",
        analog: "InterNACHI MRI (public analog)",
        body: "Age and a free look first. Name what is already on the system. i35 is three options from what they said they saw — after photos, not before.",
      },
    ],
  },
  {
    cards: `## After the knock
After the knock, wait. Do not dump the close on a cold face.

I am walking this street. That is the honest reason I stopped.

Is now a bad time for one question?

## Free look
I am walking this street offering a free look at the age of the system.

Script B: age, then a look. Not insurance talk on a retail street.

How old is the roof, if you know?

## i35
i35 is three options from what they already said they saw. Not a pitch you brought to the porch.

Photos before i35. Hail language only after they named weather.

What did you already notice up there?`,
    inspect: `## Age
Age of the system

## Granules
Granules in the gutters

## Soft spots
Soft spots an adjuster might also see`,
    briefs: `## live
Script B. Age, free look. Knock once, then listen. i35 only after photos.

## roleplay
Did they wait after the knock? Did they invent a storm year?

## mindset
One set appointment can be a winning day. Do not chase every no.`,
  },
);

export const PACKS: Record<string, BrandPack> = { field, pest, solar, roof };

export function getPack(id: string): BrandPack {
  return PACKS[id] ?? PACKS.field;
}

export const PACK_IDS = ["field", "pest", "solar", "roof"] as const;
