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
    sections.push(`## ${heading}\n\n${applyCitations(renderContent(message.content), message.metadata)}`);
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

// Web-search Citations: content_references and private-use-area markers -> Markdown.
function applyCitations(text, metadata) {
  const refs = (metadata?.content_references || [])
    .filter((r) => r.matched_text && r.type !== "sources_footnote" && r.type !== "url" &&
      !(r.type === "client_defined_widget" && r.data?.widget_type === "code_block"))
    .sort((a, b) => b.matched_text.length - a.matched_text.length);
  for (const ref of refs) {
    const sources = [
      ...(ref.items || []).flatMap((i) => [i, ...(i.supporting_websites || [])]),
      ...(ref.fallback_items || []),
      ...(ref.safe_urls || []).filter(Boolean).map((url) => ({ url })),
    ];
    const replacement = sources.length
      ? `(${sources.map((s) => `[${s.title || s.url}](${s.url})`).join(", ")})`
      : ref.alt || "";
    text = text.replaceAll(ref.matched_text, () => replacement);
  }
  return text
    .replace(/url([^-]*)([^-]+)/g, "[$1]($2)")
    .replace(/cite([^]*)+/g, "")
    .replace(/[-]/g, ""); // stray marker delimiters
}

function sanitizeFilename(name) {
  // Windows also rejects trailing dots/spaces.
  return name.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").replace(/[. ]+$/, "");
}

if (typeof module !== "undefined") module.exports = { conversationToMarkdown };
