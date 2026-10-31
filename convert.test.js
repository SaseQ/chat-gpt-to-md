import { test, expect } from "bun:test";
import { conversationToMarkdown } from "./convert.js";
import branching from "./fixtures/branching.json";

const URL = "https://chatgpt.com/c/6a1b2c3d-0000-4000-8000-000000000001";

const withTitle = (title) => ({ ...branching, title });

test("filename is the title with filesystem-illegal characters replaced", () => {
  expect(conversationToMarkdown(withTitle('Plan: a/b\\c <x> "y"? *|'), URL).filename)
    .toBe("Plan_ a_b_c _x_ _y__ __.md");
  expect(conversationToMarkdown(withTitle("Pętle w Pythonie"), URL).filename)
    .toBe("Pętle w Pythonie.md");
});

test("filename drops trailing dots and spaces", () => {
  expect(conversationToMarkdown(withTitle("  Co dalej... "), URL).filename).toBe("Co dalej.md");
});

test("missing or blank title falls back to a name based on the Conversation id", () => {
  for (const title of [null, undefined, "", "   "]) {
    const { filename, markdown } = conversationToMarkdown(withTitle(title), URL);
    expect(filename).toBe("chatgpt-6a1b2c3d-0000-4000-8000-000000000001.md");
    expect(markdown.startsWith(`# chatgpt-6a1b2c3d-0000-4000-8000-000000000001\n\n${URL}\n\n## User`)).toBe(true);
  }
});

test("exports only the current Branch, in chronological order", () => {
  expect(conversationToMarkdown(branching, URL).markdown).toBe(
`# Pętle w Pythonie

${URL}

## User

Jak zrobić pętlę **for** w Pythonie?

## ChatGPT

Użyj \`for\`:

\`\`\`python
for i in range(3):
    print(i)
\`\`\`

- prosto
- czytelnie

## User

A pętla while?

## ChatGPT

\`\`\`python
while True:
    break
\`\`\`
`);
});
