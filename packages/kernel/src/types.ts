export type TalkMode = "live" | "roleplay" | "mindset";

export type ActivityUnit = {
  id: string;
  label: string;
};

export type DoorCard = {
  id: string;
  title: string;
  hook: string;
  reason: string;
  question: string;
};

export type InspectRow = {
  id: string;
  title: string;
  body: string;
};

export type BrandPack = {
  id: string;
  productName: string;
  talkName: string;
  places: { today: string; door: string; inspect: string; plan: string };
  pwa: { name: string; shortName: string };
  modules: { storms: boolean; claim: boolean; internachi: boolean; packets: boolean };
  copy: { setup: string; pin: string; start: string; end: string };
  labor: {
    units: ActivityUnit[];
    statusToUnit: Record<string, string | null>;
  };
  cards: DoorCard[];
  inspect: InspectRow[];
  briefs: Record<TalkMode, string>;
  who: string;
  starters: string[];
  help: { title: string; body: string }[];
  scenes: string[];
};

export type PinStatus = "no-answer" | "talked" | "look" | "set" | "revisit" | "skip";

export const PIN_STATUSES: PinStatus[] = [
  "no-answer",
  "talked",
  "look",
  "set",
  "revisit",
  "skip",
];

export type PackSource = {
  yaml: string;
  cards: string;
  inspect: string;
  briefs: string;
};

export type TalkContext = {
  mode: TalkMode;
  model: string;
  system: string;
  posted: {
    today: string;
    pin: string;
    mindset: string;
    memory: string;
    who: string;
  };
};
