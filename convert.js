// Pure conversion: ChatGPT /backend-api/conversation JSON -> Markdown.
// Loaded as a classic script in the page (global function) and as a module in `bun test`.

function conversationToMarkdown(conversationJson, conversationUrl) {
  const { title, mapping, current_node } = conversationJson;

  // Current Branch: walk from current_node up via parent, then reverse.
  const branch = [];
  for (let id = current_node; id; id = mapping[id].parent) branch.unshift(mapping[id]);

  const sections = [];
  for (const { message } of branch) {
    if (!message) continue;
    const heading = message.author.role === "user" ? "User" : "ChatGPT";
    sections.push(`## ${heading}\n\n${renderContent(message.content)}`);
  }

  const fallback = `chatgpt-${conversationJson.conversation_id}`;
  const name = (title || "").trim() || fallback;
  const markdown = [`# ${name}`, conversationUrl, ...sections].join("\n\n") + "\n";
  return { filename: (sanitizeFilename(name) || fallback) + ".md", markdown };
}

function renderContent(content) {
  switch (content.content_type) {
    case "text":
      return content.parts.join("\n");
    case "code":
      return "```" + (content.language || "") + "\n" + content.text + "\n```";
  }
}

function sanitizeFilename(name) {
  // Windows also rejects trailing dots/spaces.
  return name.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").replace(/[. ]+$/, "");
}

if (typeof module !== "undefined") module.exports = { conversationToMarkdown };
