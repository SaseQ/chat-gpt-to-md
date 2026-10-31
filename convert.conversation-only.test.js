import { test, expect } from "bun:test";
import { conversationToMarkdown } from "./convert.js";
import noise from "./fixtures/noise.json";

const URL = "https://chatgpt.com/c/6a1b2c3d-0000-4000-8000-000000000003";
const { markdown } = conversationToMarkdown(noise, URL);

test("skips system, hidden context, reasoning, preambles, tool calls and tool output", () => {
  for (const leaked of [
    "SYSTEM PROMPT", "PROFIL", "INSTRUKCJE", "UKRYTY KONTEKST", "MYŚL", "PREAMBUŁA",
    "WYWOŁANIE", "WYNIK NARZĘDZIA", "WYNIK FILE_SEARCH", "PAMIĘĆ", "MYŚLAŁ",
  ]) expect(markdown).not.toContain(leaked);
});

test("consecutive ChatGPT fragments form one section, empty replies vanish", () => {
  expect(markdown).toContain("## User\n\nPolicz coś.\n\n## ChatGPT\n\nCzęść pierwsza.\n\nCzęść druga.\n\n## User");
});

test("interactive reply exports its fallbackMarkdown, unknown content leaves a marker", () => {
  expect(markdown).toBe(
`# Szum

${URL}

## User

Policz coś.

## ChatGPT

Część pierwsza.

Część druga.

## User

Pokaż tabelę.

## ChatGPT

| a | b |
|---|---|
| 1 | 2 |

[Nieobsługiwana treść: tether_quote]
`);
});
