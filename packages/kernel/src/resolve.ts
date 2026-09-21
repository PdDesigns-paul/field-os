const KNOWN = new Set(["field", "roof", "pest", "solar"]);

export function resolvePack(input: { id?: string; host?: string }): string {
  const host = (input.host ?? "").toLowerCase();
  if (host.includes("grok.me") || host.includes("grok.com")) return "field";

  const id = (input.id ?? "").trim().toLowerCase();
  if (KNOWN.has(id)) return id;
  return "field";
}
