// Pure conversion: ChatGPT /backend-api/conversation JSON -> Markdown.
// Loaded as a classic script in the page (global function) and as a module in `bun test`.
// IIFE so injecting it again on the next click doesn't redeclare the top-level consts.
(() => {
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
    const fromChatGPT = message.author.role !== "user";
    const body = applyCitations(renderContent(message), message.metadata);
    if (fromChatGPT && !body.trim()) continue;
    const last = sections.at(-1);
    if (fromChatGPT && last?.fromChatGPT) last.bodies.push(body);
    else sections.push({ fromChatGPT, bodies: [body] });
  }

  const id = conversationJson.conversation_id ?? conversationUrl?.match(/\/c\/([^/?#]+)/)?.[1];
  const fallback = `chatgpt-${id}`;
  const name = (title || "").trim() || fallback;
  const sectionBlocks = sections.map((s) => `## ${s.fromChatGPT ? "ChatGPT" : "User"}\n\n${s.bodies.join("\n\n")}`);
  const markdown = [`# ${name}`, conversationUrl, ...sectionBlocks].join("\n\n") + "\n";
  return { filename: (sanitizeFilename(name) || fallback) + ".md", markdown };
}

const HIDDEN_CONTENT_TYPES = ["thoughts", "reasoning_recap", "model_editable_context", "user_editable_context"];

// What the user sees as the conversation; everything else (system, hidden context, reasoning, tool traffic) is dropped.
function isConversationMessage({ author, recipient, content, metadata = {} }) {
  if (author.role === "system") return false;
  if (author.role === "tool" && (author.name === "file_search" || !toolImageCount({ content, metadata }))) return false;
  if (recipient !== "all") return false;
  if (HIDDEN_CONTENT_TYPES.includes(content.content_type)) return false;
  return !metadata.is_visually_hidden_from_conversation && !metadata.is_thinking_preamble_message;
}

const isImagePart = (p) => p?.content_type === "image_asset_pointer";
// file-service://file-X and sediment://file_X both point at the attachment id after "://".
const pointerId = (p) => p.asset_pointer?.split("://")[1];
const unsupported = (type) => `[Nieobsługiwana treść: ${type}]`;
const textPart = (p) => (typeof p === "string" ? p : unsupported(p?.content_type));

// Generated images (multimodal_text) and code-interpreter charts (execution_output).
function toolImageCount({ content, metadata = {} }) {
  if (content.content_type === "multimodal_text") return content.parts.filter(isImagePart).length;
  if (content.content_type === "execution_output")
    return (metadata.aggregate_result?.messages || []).filter((m) => m.message_type === "image").length;
  return 0;
}

function renderContent({ author, content, metadata = {} }) {
  if (author.role === "tool") return Array(toolImageCount({ content, metadata })).fill("[obraz]").join("\n");
  const attachments = (author.role === "user" && metadata.attachments) || [];
  switch (content.content_type) {
    case "multimodal_text": {
      const shown = new Set(content.parts.filter(isImagePart).map(pointerId));
      const imagePlaceholder = (part) => {
        const fileName = attachments.find((a) => a.id === pointerId(part))?.name;
        return fileName ? `[obraz: ${fileName}]` : "[obraz]";
      };
      const body = content.parts
        .map((p) => (isImagePart(p) ? imagePlaceholder(p) : textPart(p)))
        .filter(Boolean)
        .join("\n");
      return withAttachments(body, attachments.filter((a) => !shown.has(a.id)));
    }
    case "text":
      return withAttachments(metadata.model_dil_v2?.fallbackMarkdown ?? content.parts.map(textPart).join("\n"), attachments);
    case "code":
      return "```" + (content.language || "") + "\n" + content.text + "\n```";
    default:
      return unsupported(content.content_type);
  }
}

// User files as a 📎 list; images already shown inline are excluded by the caller.
function withAttachments(body, attachments) {
  const list = attachments.map((a) => `📎 ${a.name}`).join("\n");
  return [body, list].filter(Boolean).join("\n\n");
}

// Web-search Citations: content_references and private-use-area markers -> Markdown.
// Markers look like <kind><arg>....
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
    .replace(/entity([^]*)/g, (_, json) => entityName(json))
    .replace(/[^]*/g, "") // citations and any other complete marker
    .replace(/[-]/g, ""); // stray marker delimiters
}

// entity["city","Paris",...] -> "Paris"; unparseable -> nothing.
function entityName(json) {
  try {
    const name = JSON.parse(json)[1];
    return typeof name === "string" ? name : "";
  } catch {
    return "";
  }
}

const MAX_FILENAME_LENGTH = 200; // before ".md"; well under the 255 filesystem limit

function sanitizeFilename(name) {
  let safe = name.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_");
  if (safe.length > MAX_FILENAME_LENGTH) {
    // Cut by code points so a surrogate pair is never split.
    let cut = "";
    for (const ch of safe) {
      if (cut.length + ch.length > MAX_FILENAME_LENGTH) break;
      cut += ch;
    }
    safe = cut;
  }
  safe = safe.replace(/[. ]+$/, ""); // Windows rejects trailing dots/spaces
  return /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(safe) ? safe + "_" : safe;
}

globalThis.conversationToMarkdown = conversationToMarkdown;
if (typeof module !== "undefined") module.exports = { conversationToMarkdown };
})();
