# 02: Czytelne błędy zamiast cichej porażki

**What to build:** Gdy Eksport nie może się udać, użytkownik dostaje czytelny komunikat i żaden plik się nie pobiera. Kliknięcie na zwykłej stronie poza Konwersacją (inna strona, strona główna ChatGPT, `/share/...`) → „to nie jest Konwersacja”. Brak tokena lub 401 → „zaloguj się”. Inny błąd HTTP lub błąd struktury odpowiedzi → „ChatGPT zmienił API, zaktualizuj wtyczkę”. Moduł konwersji ma kontrakt „zwraca kompletny wynik albo rzuca wyjątek” i nie zawiesza się na cyklu. Błąd samego wstrzyknięcia (np. strony `chrome://`, Chrome Web Store) jest łapany w backgroundzie i tylko logowany. Szczegóły: spec, „Implementation Decisions” — Moduły, Wybór Gałęzi, Błędy struktury, Błędy.

**Blocked by:** 01 (Tracer bullet — kliknięcie ikony pobiera Eksport prostej Konwersacji)

**Status:** done

- [x] Kliknięcie na zwykłej stronie poza Konwersacją pokazuje alert „to nie jest Konwersacja” i nic nie pobiera. (sprawdzone ręcznie 2026-10-31)
- [ ] Brak tokena / odpowiedź 401 pokazuje alert o zalogowaniu i nic nie pobiera. (manual check pending)
- [ ] Inny błąd HTTP pokazuje alert „ChatGPT zmienił API, zaktualizuj wtyczkę” i nic nie pobiera. (manual check pending)
- [x] `conversationToMarkdown` rzuca wyjątek przy: braku `mapping`, braku `current_node` lub `current_node` nieobecnym w `mapping`, `parent` wskazującym na nieistniejący węzeł, cyklu (liczba kroków ograniczona liczbą węzłów).
- [ ] Wyjątek z modułu konwersji kończy się alertem „ChatGPT zmienił API, zaktualizuj wtyczkę” i nic się nie pobiera. (catch w `content.js`; manual check pending)
- [x] Błąd wstrzyknięcia jest łapany w backgroundzie i logowany w konsoli workera; brak UI i brak nowych uprawnień.
- [x] `bun test`: fixture'y błędów struktury (brak `current_node`, urwany łańcuch, cykl) potwierdzają rzucenie wyjątku bez zawieszenia. (`convert.errors.test.js`)
