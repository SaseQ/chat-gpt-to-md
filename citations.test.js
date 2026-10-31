import { test, expect } from "bun:test";
import { conversationToMarkdown } from "./convert.js";
import citations from "./fixtures/citations.json";

const md = () => conversationToMarkdown(citations, "https://chatgpt.com/c/x").markdown;

test("reference with sources becomes inline links", () => {
  expect(md()).toContain("Wydano Pythona 3.13. ([Python News](https://python.org/news), [Wiki](https://wiki.org/Python))\n");
});

test("reference without sources becomes its alt text; empty alt becomes nothing", () => {
  expect(md()).toContain("Darmowy (open source)\n");
  expect(md()).toContain("Pusty alt.\n");
});

test("longest matched_text is replaced first; fallback_items and safe_urls count as sources", () => {
  expect(md()).toContain("Zagnieżdżony ([PEP 703](https://peps.python.org/pep-0703/))\n");
  expect(md()).toContain("Bezpieczny ([https://safe.example](https://safe.example))\n");
});

test("sources_footnote, url and code-block widget references leave the text untouched", () => {
  expect(md()).toContain("## ChatGPT\n\nWydano Pythona 3.13. ");
  expect(md()).toContain("Zobacz [docs](https://docs.python.org).\n\n```python\nprint(1)\n```\n");
});

test("inline link markers become Markdown links and leftover citation markers are removed", () => {
  expect(md()).toContain("Więcej: [Python.org](https://python.org) Koniec.\n");
  expect(md()).not.toMatch(/[-]/);
});
