import { test, expect } from "bun:test";
import { conversationToMarkdown } from "./convert.js";
import images from "./fixtures/images.json";

const URL = "https://chatgpt.com/c/6a1b2c3d-0000-4000-8000-000000000004";
const { markdown } = conversationToMarkdown(images, URL);

test("images become name placeholders, attachments a 📎 list, tool images join the ChatGPT section", () => {
  expect(markdown).toBe(
`# Obrazki

${URL}

## User

[obraz: kot.png]
[obraz]
Co jest na zdjęciu?

📎 raport.pdf

## ChatGPT

[obraz]

Oto kot.

[obraz]
[obraz]

Oto wykresy.
`);
});

test("no tool text, execution output, file_search or file addresses leak", () => {
  for (const leaked of ["TEKST NARZĘDZIA", "WYNIK", "WYWOŁANIE", "sediment://", "file-service://", "file_"])
    expect(markdown).not.toContain(leaked);
});
