# 04: Obrazki i załączniki jako placeholdery

**What to build:** W miejscu obrazków i plików z rozmowy plik zawiera placeholdery z nazwą zamiast linków, które wkrótce przestałyby działać. Obrazek wklejony przez użytkownika → `[obraz: <nazwa>]` w jego wiadomości. Obraz wygenerowany przez ChatGPT (generator obrazów) i wykres z code interpretera → placeholder w sekcji „ChatGPT”, bez tekstu narzędzia i bez wyniku wykonania. Załączniki użytkownika → lista `📎 <nazwa>` przy jego wiadomości. Po oryginały użytkownik wraca przez link do Konwersacji pod tytułem. Szczegóły: spec, „Implementation Decisions” — Filtrowanie wiadomości (wyjątek dla `tool`), Scalanie, Renderowanie treści.

**Blocked by:** 03 (Eksport zawiera tylko faktyczną rozmowę)

**Status:** done

- [x] `multimodal_text`: części tekstowe jako tekst, `image_asset_pointer` jako `[obraz: <nazwa>]`; obsługiwane wskaźniki `file-service://` i `sediment://`; brak nazwy → `[obraz]`.
- [x] Wiadomość `author.role` = `tool` z `image_asset_pointer` w `multimodal_text` jest zachowana i renderowana wyłącznie jako placeholder(y) obrazu w sekcji „ChatGPT”.
- [x] Wiadomość `author.role` = `tool` z `execution_output` zawierającym obraz w `metadata.aggregate_result.messages` daje `[obraz]` dla każdego obrazu, bez tekstowego wyniku.
- [x] Zachowane wiadomości narzędzi z obrazem scalają się z sąsiednimi odpowiedziami asystenta w jedną sekcję „ChatGPT”.
- [x] Załączniki z `metadata.attachments` jako lista `📎 <nazwa>` przy wiadomości użytkownika.
- [x] W pliku nie ma żadnych podpisanych adresów obrazków ani plików.
- [x] `bun test`: fixture zawiera obrazek użytkownika (`sediment://`), załącznik, wiadomość narzędzia z wygenerowanym obrazem i z wykresem `execution_output`; wynik potwierdza placeholdery i brak tekstu narzędzia.
