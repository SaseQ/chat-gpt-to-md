# 03: Eksport zawiera tylko faktyczną rozmowę

**What to build:** Plik zawiera wyłącznie to, co użytkownik widzi jako rozmowę: jego wiadomości i odpowiedzi ChatGPT. Pomijane są wiadomości systemowe, ukryty kontekst, wywołania narzędzi, rozumowanie modelu, preambuły i puste odpowiedzi. Odpowiedź podzielona na kilka kolejnych fragmentów pojawia się jako jedna sekcja „ChatGPT”. Interaktywne odpowiedzi eksportują swoją wersję Markdown zamiast surowego widgetu. Treść nieobsługiwanego typu zostawia widoczny znacznik, zamiast cicho zniknąć. Szczegóły: spec, „Implementation Decisions” — Filtrowanie wiadomości, Scalanie, Renderowanie treści.

**Blocked by:** 01 (Tracer bullet — kliknięcie ikony pobiera Eksport prostej Konwersacji)

**Status:** ready-for-agent

- [ ] Pomijane: `author.role` = `system`; `recipient` różny od `all`; `content_type` `thoughts`, `reasoning_recap`, `model_editable_context`, `user_editable_context`; wiadomości z `is_visually_hidden_from_conversation` lub `is_thinking_preamble_message`; puste odpowiedzi asystenta.
- [ ] Wiadomości `author.role` = `tool` są pomijane (wyjątek dla wiadomości narzędzi z obrazem dochodzi w tickecie 04); `file_search` pomijane zawsze.
- [ ] Kolejne wiadomości renderowane jako „ChatGPT” są scalane w jedną sekcję.
- [ ] Gdy istnieje `metadata.model_dil_v2.fallbackMarkdown`, używany jest zamiast `parts`.
- [ ] Nieznany `content_type` w wiadomości, która przeszła filtrowanie, daje znacznik `[Nieobsługiwana treść: <content_type>]`; Eksport się nie przerywa.
- [ ] `bun test`: fixture zawiera wiadomość systemową, ukrytą, `thoughts`, wywołanie narzędzia bez obrazu, kolejne fragmenty asystenta, widget z `fallbackMarkdown` i nieznany `content_type`; wynik potwierdza każdą z reguł powyżej.
