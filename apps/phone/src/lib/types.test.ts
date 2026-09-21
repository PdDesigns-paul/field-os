import assert from "node:assert/strict";
import { test } from "node:test";
import { CONTROL_TYPES } from "./types.ts";

test("five control types, no sixth", () => {
  assert.deepEqual(CONTROL_TYPES, ["place", "do", "chip", "go", "talk"]);
  assert.equal(CONTROL_TYPES.length, 5);
});
