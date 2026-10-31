# 05: Cytowania jako linki inline

**What to build:** Odpowiedzi z wyszukiwaniem w sieci mają w pliku źródła jako linki inline `([tytuł](url))` zamiast niewidocznych znaczników. Referencje bez źródeł zostają zastąpione tekstem zastępczym od ChatGPT, a widoczna treść oznaczona referencją (bloki kodu, linki) nie jest wycinana. W pliku nie zostają śmieciowe znaki z prywatnego zakresu Unicode. Szczegóły: spec, „Implementation Decisions” — Cytowania i referencje (5 kroków, w tej kolejności).

**Blocked by:** 01 (Tracer bullet — kliknięcie ikony pobiera Eksport prostej Konwersacji)

**Status:** ready-for-agent

- [ ] Referencje `sources_footnote` nie są podmieniane w tekście.
- [ ] Referencje typu `url` oraz `client_defined_widget` z widgetem bloku kodu zostawiają treść nienaruszoną.
- [ ] Pozostałe referencje z niepustym `matched_text`, przetwarzane od najdłuższego `matched_text`: ze źródłami (`items`, `supporting_websites`, `fallback_items`, `safe_urls`) → linki inline `([tytuł](url))`; bez źródeł → pole `alt` (pusty `alt` → pusty tekst).
- [ ] Znaczniki linków inline z prywatnego zakresu Unicode (`url` + etykieta + adres) → `[etykieta](adres)`.
- [ ] Na końcu usuwane są pozostałe znaczniki cytowań z prywatnego zakresu Unicode.
- [ ] `bun test`: fixture zawiera referencję ze źródłem, bez źródła z `alt`, typu `url`, widget bloku kodu, pozostały znacznik cytowania i znacznik linku inline; wynik potwierdza każdy przypadek.
