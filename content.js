// Injected on icon click, after convert.js. IIFE so re-injection on the next click doesn't redeclare anything.
(async () => {
  const NOT_CONVERSATION = "To nie jest Konwersacja ChatGPT. Otwórz rozmowę (adres /c/...) i kliknij ponownie.";
  const LOG_IN = "Zaloguj się do ChatGPT i spróbuj ponownie.";
  const API_CHANGED = "ChatGPT zmienił API, zaktualizuj wtyczkę.";
  // Thrown for errors whose message is already meant for the user; anything else maps to API_CHANGED.
  const fail = (msg) => { throw Object.assign(new Error(msg), { forUser: true }); };

  try {
    const url = location.href; // captured now: the user may switch Konwersacja during the fetches
    const id = location.pathname.match(/^\/(?:g\/[^/]+\/)?c\/([0-9a-f-]+)/i)?.[1];
    if (location.hostname !== "chatgpt.com" || !id) fail(NOT_CONVERSATION);

    const session = await fetch("/api/auth/session");
    if (session.status === 401) fail(LOG_IN);
    if (!session.ok) throw new Error(`Session HTTP ${session.status}`);
    const { accessToken } = await session.json(); // logged out → 200 with {} → no token
    if (!accessToken) fail(LOG_IN);

    const res = await fetch(`/backend-api/conversation/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.status === 401) fail(LOG_IN);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const { filename, markdown } = conversationToMarkdown(await res.json(), url);

    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([markdown], { type: "text/markdown" }));
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  } catch (e) {
    if (!e.forUser) console.error("Eksport nie powiódł się:", e);
    alert(e.forUser ? e.message : API_CHANGED);
  }
})();
