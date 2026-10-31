# ChatGPT to Markdown

A Chromium browser extension that exports the open ChatGPT conversation to a Markdown file in one click.

- Exports the full current branch, including older messages the page hasn't loaded yet
- Keeps the original Markdown: headings, lists, tables, code blocks
- Turns web-search citations into inline links
- Replaces images and attachments with placeholders
- Skips system messages, tool calls and model reasoning

## Install

1. Clone or download this repo.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and select the repo folder.

## Usage

Open a conversation on `chatgpt.com` (a `/c/...` URL) and click the extension icon. The `.md` file downloads right away.

The extension uses your logged-in ChatGPT session and sends nothing anywhere else.

## Tests

```sh
bun test
```
