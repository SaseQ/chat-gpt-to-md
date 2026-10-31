# 01: Tracer bullet — kliknięcie ikony pobiera Eksport prostej Konwersacji

**What to build:** Na stronie Konwersacji ChatGPT (`/c/<id>` lub `/g/.../c/<id>`) kliknięcie ikony wtyczki od razu pobiera plik `.md` z aktualną Gałęzią: nagłówek z tytułem, link do Konwersacji, naprzemienne sekcje `## User` / `## ChatGPT` z treścią tekstową i blokami kodu. Pierwszy kompletny przekrój: manifest MV3 (`activeTab` + `scripting`, bez popupu), background wstrzykujący moduł konwersji i skrypt treści, skrypt treści pobierający token z `/api/auth/session` i Konwersację z `/backend-api/conversation/<id>`, zapis przez Blob + `download`. Moduł konwersji to czysta funkcja `conversationToMarkdown(conversationJson, conversationUrl) → { filename, markdown }`, ładowana jako klasyczny skrypt w przeglądarce i jako moduł w `bun test`. Szczegóły: spec, sekcje „Implementation Decisions” (Platforma, Uprawnienia, Moduły, Źródło danych, Rozpoznawanie Konwersacji, Wybór Gałęzi, Format pliku, Nazwa pliku) i ADR 0001.

**Blocked by:** None (can start immediately)

**Status:** done

- [ ] Wtyczka ładuje się przez „Load unpacked” bez kroku budowania i bez zależności npm; manifest deklaruje wyłącznie `activeTab` i `scripting`. (manifest gotowy, brak builda i npm; manual check pending: Load unpacked)
- [ ] Kliknięcie ikony na Konwersacji pobiera `.md` bez popupu. (manual check pending)
- [ ] Id Konwersacji jest rozpoznawane w ścieżkach `/c/<id>` i `/g/<gizmo-lub-projekt>/c/<id>`. (regex w `content.js`; manual check pending)
- [x] Plik zaczyna się `# <tytuł>`, pustą linią i linkiem do Konwersacji; dalej sekcje `## User` / `## ChatGPT`, bez YAML frontmattera.
- [x] Eksport zawiera tylko aktualną Gałąź (od `current_node` w górę po `parent`, w kolejności chronologicznej).
- [x] Treść `text` zachowuje oryginalny Markdown; treść `code` renderowana jako blok kodu.
- [x] Nazwa pliku to tytuł oczyszczony ze znaków niedozwolonych w nazwach plików + `.md`; brak tytułu → nazwa zastępcza z id Konwersacji.
- [x] `bun test` przechodzi; syntetyczny fixture z rozgałęzieniem (edycja i regeneracja) potwierdza, że w wyniku jest tylko aktualna Gałąź; testy nazwy pliku pokrywają znaki niedozwolone i brak tytułu.
- [x] Testy sprawdzają wyłącznie wynik `conversationToMarkdown`, nie wewnętrzne helpery.
