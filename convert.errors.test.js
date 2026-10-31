import { test, expect } from "bun:test";
import { conversationToMarkdown } from "./convert.js";

const URL = "https://chatgpt.com/c/6a1b2c3d-0000-4000-8000-000000000001";
const node = (id, parent) => ({ id, parent, children: [], message: null });

// Structure Errors: the converter throws instead of returning a partial Export (or hanging).
const broken = {
  "missing mapping": { title: "x", current_node: "a" },
  "missing current_node": { title: "x", mapping: { a: node("a", null) } },
  "current_node absent from mapping": { title: "x", current_node: "zzz", mapping: { a: node("a", null) } },
  "parent pointing to a missing node": { title: "x", current_node: "b", mapping: { b: node("b", "gone") } },
  "cycle in the parent chain": { title: "x", current_node: "a", mapping: { a: node("a", "b"), b: node("b", "a") } },
  "self-loop": { title: "x", current_node: "a", mapping: { a: node("a", "a") } },
};

for (const [name, json] of Object.entries(broken)) {
  test(`throws on ${name}`, () => {
    expect(() => conversationToMarkdown(json, URL)).toThrow(Error);
  });
}
