// Pure conversion: ChatGPT /backend-api/conversation JSON -> Markdown.
// Loaded as a classic script in the page (global function) and as a module in `bun test`.

function conversationToMarkdown(conversationJson, conversationUrl) {
  const { title, mapping, current_node } = conversationJson;

  // Current Branch: walk from current_node up via parent, then reverse.
  // Structure Errors throw; steps are capped at the node count, so a cycle throws instead of hanging.
  if (!mapping) throw new Error("Structure Error: missing mapping");
  if (!current_node) throw new Error("Structure Error: missing current_node");
  const limit = Object.keys(mapping).length;
  const branch = [];
  for (let id = current_node; id; id = mapping[id].parent) {
    if (!Object.hasOwn(mapping, id)) throw new Error(`Structure Error: node ${id} not in mapping`);
    if (branch.length === limit) throw new Error("Structure Error: cycle in parent chain");
    branch.unshift(mapping[id]);
  }

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
