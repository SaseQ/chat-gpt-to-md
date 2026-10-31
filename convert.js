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
    if (!message || !isConversationMessage(message)) continue;
    const heading = message.author.role === "user" ? "User" : "ChatGPT";
    const body = applyCitations(renderContent(message), message.metadata);
    if (heading === "ChatGPT" && !body.trim()) continue;
    const last = sections.at(-1);
    if (heading === "ChatGPT" && last?.heading === "ChatGPT") last.bodies.push(body);
    else sections.push({ heading, bodies: [body] });
  }

  const fallback = `chatgpt-${conversationJson.conversation_id}`;
  const name = (title || "").trim() || fallback;
  const markdown = [`# ${name}`, conversationUrl, ...sections.map((s) => `## ${s.heading}\n\n${s.bodies.join("\n\n")}`)].join("\n\n") + "\n";
  return { filename: (sanitizeFilename(name) || fallback) + ".md", markdown };
}

const HIDDEN_CONTENT_TYPES = ["thoughts", "reasoning_recap", "model_editable_context", "user_editable_context"];

// What the user sees as the conversation; everything else (system, hidden context, reasoning, tool traffic) is dropped.
function isConversationMessage({ author, recipient, content, metadata = {} }) {
  if (author.role === "system" || author.role === "tool") return false; // ticket 04: tool messages with images
  if (recipient !== "all") return false;
  if (HIDDEN_CONTENT_TYPES.includes(content.content_type)) return false;
  return !metadata.is_visually_hidden_from_conversation && !metadata.is_thinking_preamble_message;
}

function renderContent({ content, metadata }) {
  switch (content.content_type) {
    case "text":
      return metadata?.model_dil_v2?.fallbackMarkdown ?? content.parts.join("\n");
    case "code":
      return "```" + (content.language || "") + "\n" + content.text + "\n```";
    default:
      return `[Nieobsługiwana treść: ${content.content_type}]`;
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
