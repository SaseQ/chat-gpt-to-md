// Injected on icon click, after convert.js. IIFE so re-injection on the next click doesn't redeclare anything.
(async () => {
  try {
    const id = location.pathname.match(/^\/(?:g\/[^/]+\/)?c\/([0-9a-f-]+)/i)?.[1];
    if (!id) throw new Error("To nie jest Konwersacja ChatGPT.");

    const { accessToken } = await (await fetch("/api/auth/session")).json();
    const res = await fetch(`/backend-api/conversation/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`Błąd HTTP ${res.status}.`);

    const { filename, markdown } = conversationToMarkdown(await res.json(), location.href);

    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([markdown], { type: "text/markdown" }));
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  } catch (e) {
    // ponytail: bare message; readable per-case messages come in ticket 02.
    alert(`Eksport nie powiódł się: ${e.message}`);
  }
})();
