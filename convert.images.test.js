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

test("unsupported multimodal parts and non-string text parts become an unsupported-content marker", () => {
  const json = { title: "t", current_node: "u", mapping: { u: { id: "u", parent: null, message: {
    author: { role: "user" }, recipient: "all", metadata: {},
    content: { content_type: "multimodal_text", parts: ["Hej", { content_type: "audio_transcription", text: "x" }] },
  } } } };
  expect(conversationToMarkdown(json, URL).markdown).toContain("Hej\n[Nieobsługiwana treść: audio_transcription]\n");
  json.mapping.u.message.content = { content_type: "text", parts: [{ content_type: "audio_transcription" }] };
  const out = conversationToMarkdown(json, URL).markdown;
  expect(out).not.toContain("[object Object]");
  expect(out).toContain("[Nieobsługiwana treść: audio_transcription]");
});
