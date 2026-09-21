export const CONTROL_TYPES = ["place", "do", "chip", "go", "talk"] as const;

export type ControlType = (typeof CONTROL_TYPES)[number];
