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

test("filename is capped in length without splitting a surrogate pair", () => {
  const { filename } = conversationToMarkdown(withTitle("a" + "😀".repeat(150)), URL);
  expect(filename.length).toBeLessThanOrEqual(203);
  expect(filename).not.toMatch(/[\ud800-\udbff](?![\udc00-\udfff])|(?<![\ud800-\udbff])[\udc00-\udfff]/);
  expect(filename.endsWith(".md")).toBe(true);
});

test("Windows reserved names get an underscore appended", () => {
  for (const title of ["CON", "nul", "Com1", "LPT9", "aux"])
    expect(conversationToMarkdown(withTitle(title), URL).filename).toBe(`${title}_.md`);
  expect(conversationToMarkdown(withTitle("CONsole"), URL).filename).toBe("CONsole.md");
});

test("without title and conversation_id the fallback name uses the id from the URL", () => {
  const { conversation_id, ...rest } = withTitle(null);
  expect(conversationToMarkdown(rest, URL).filename).toBe("chatgpt-6a1b2c3d-0000-4000-8000-000000000001.md");
});

test("convert.js can be injected twice into the same page", async () => {
  const vm = await import("node:vm");
  const src = await Bun.file(`${import.meta.dir}/convert.js`).text();
  const ctx = vm.createContext({});
  vm.runInContext(src, ctx);
  expect(() => vm.runInContext(src, ctx)).not.toThrow();
  expect(ctx.conversationToMarkdown(branching, URL).filename).toBe("Pętle w Pythonie.md");
});

test("code containing a ``` line gets a longer fence so the block stays intact", () => {
  const conv = {
    title: "Fence",
    current_node: "a",
    mapping: {
      a: { parent: null, message: { author: { role: "assistant" }, recipient: "all", metadata: {},
        content: { content_type: "code", language: "md", text: "```js\nx\n````" } } },
    },
  };
  expect(conversationToMarkdown(conv, URL).markdown).toBe(
    `# Fence\n\n${URL}\n\n## ChatGPT\n\n\`\`\`\`\`md\n\`\`\`js\nx\n\`\`\`\`\n\`\`\`\`\`\n`);
});
