# Spec: Eksport Konwersacji ChatGPT do Markdown

## Problem Statement

Chcę mieć swoje rozmowy z ChatGPT jako zwykłe pliki Markdown — do notatek, archiwum, wklejenia w inne narzędzia. ChatGPT nie daje eksportu pojedynczej Konwersacji: oficjalny eksport danych to ZIP całego konta, przychodzi mailem z opóźnieniem, a kopiowanie ręczne gubi formatowanie, bloki kodu i strukturę rozmowy. Dodatkowo strona ładuje wiadomości leniwie, więc nawet zaznaczenie i skopiowanie całej długiej rozmowy jest niepewne.

## Solution

Prosta wtyczka do przeglądarek Chromium. Gdy jestem na stronie Konwersacji na chatgpt.com, klikam ikonę wtyczki na pasku i od razu pobiera się plik `.md` z całą aktualną Gałęzią tej Konwersacji — moje wiadomości i odpowiedzi ChatGPT, z zachowanym Markdownem (nagłówki, listy, kod), linkami do źródeł i placeholderami w miejscu obrazków oraz plików. Na górze pliku jest tytuł i link do oryginalnej Konwersacji. Gdy coś pójdzie nie tak (nie jestem na Konwersacji, wylogowanie, zmiana API po stronie ChatGPT), dostaję czytelny komunikat zamiast cichej porażki lub pustego pliku.

## User Stories

1. As a użytkownik ChatGPT, I want pobrać otwartą Konwersację jednym kliknięciem ikony wtyczki, so that nie muszę niczego kopiować ręcznie.
2. As a użytkownik, I want żeby kliknięcie od razu pobrało plik bez otwierania popupu, so that eksport jest natychmiastowy.
3. As a użytkownik, I want dostać plik w formacie Markdown, so that mogę go otworzyć w dowolnym edytorze lub narzędziu do notatek.
4. As a użytkownik, I want żeby w pliku była cała Konwersacja, także najstarsze wiadomości, których strona jeszcze nie doładowała, so that eksport jest kompletny niezależnie od przewinięcia.
5. As a użytkownik, I want żeby eksportowana była tylko aktualna Gałąź — ta, którą widzę na ekranie, so that plik odpowiada temu, co czytam, bez porzuconych wariantów.
6. As a użytkownik, który edytował wcześniejsze pytanie, I want żeby w pliku była tylko wersja po edycji, so that nie mieszają się dwie wersje rozmowy.
7. As a użytkownik, który wygenerował odpowiedź ponownie, I want żeby w pliku była tylko odpowiedź aktualnie wybrana na ekranie, so that plik nie zawiera duplikatów odpowiedzi.
8. As a użytkownik, I want żeby plik zaczynał się nagłówkiem z tytułem Konwersacji, so that od razu wiem, czego dotyczy.
9. As a użytkownik, I want pod tytułem link do oryginalnej Konwersacji na chatgpt.com, so that mogę wrócić do źródła, np. po obrazki i załączniki.
10. As a użytkownik, I want żeby każda moja wiadomość była oznaczona nagłówkiem „User”, so that widzę, kto co napisał.
11. As a użytkownik, I want żeby każda odpowiedź była oznaczona nagłówkiem „ChatGPT”, so that łatwo odróżniam odpowiedzi od pytań.
12. As a użytkownik, I want żeby odpowiedzi zachowały oryginalny Markdown (nagłówki, listy, tabele, pogrubienia), so that plik wygląda jak w ChatGPT.
13. As a użytkownik, I want żeby bloki kodu zachowały język i formatowanie, so that mogę kopiować kod z pliku.
14. As a użytkownik, I want żeby odpowiedź podzielona przez ChatGPT na kilka kolejnych fragmentów pojawiła się w pliku jako jedna wiadomość, so that tekst się nie rwie.
15. As a użytkownik, I want żeby w pliku nie było wiadomości systemowych ani ukrytego kontekstu, so that plik zawiera tylko faktyczną rozmowę.
16. As a użytkownik, I want żeby w pliku nie było wywołań narzędzi (wyszukiwanie, code interpreter) ani ich surowych wyników, so that plik jest czytelny.
17. As a użytkownik modeli z „myśleniem”, I want żeby w pliku nie było treści rozumowania modelu, so that zostaje tylko finalna odpowiedź.
18. As a użytkownik, I want żeby wiadomości ukryte w interfejsie ChatGPT były pominięte także w pliku, so that plik odpowiada temu, co widzę.
19. As a użytkownik, I want żeby puste odpowiedzi asystenta były pominięte, so that w pliku nie ma pustych sekcji.
20. As a użytkownik, który wkleił obrazek, I want placeholder z nazwą obrazka w miejscu, gdzie występował, so that wiem, że w rozmowie był obrazek.
21. As a użytkownik, któremu ChatGPT wygenerował obrazek lub wykres (generator obrazów, code interpreter), I want placeholder obrazka w odpowiedzi ChatGPT, so that wiem, że odpowiedź zawierała obraz, mimo że wiadomości narzędzi są pomijane.
22. As a użytkownik, który załączył plik (np. PDF), I want placeholder z nazwą załącznika przy mojej wiadomości, so that wiem, do czego odnosiło się pytanie.
23. As a użytkownik, I want żeby obrazki i pliki nie były linkowane podpisanymi adresami, so that plik nie zawiera linków, które wkrótce przestaną działać.
24. As a użytkownik odpowiedzi z wyszukiwaniem w sieci, I want żeby cytowania były zamienione na linki inline z tytułem źródła, so that mogę sprawdzić źródła z pliku.
25. As a użytkownik, I want żeby referencja bez danych o źródle została zastąpiona jej tekstem zastępczym podanym przez ChatGPT, a pozostałe niewidoczne znaczniki cytowań usunięte, so that w pliku nie ma śmieciowych znaków ani nie znika widoczna treść.
26. As a użytkownik, I want żeby bloki kodu i inna widoczna treść oznaczona przez ChatGPT referencją nie zostały wycięte przy obsłudze cytowań, so that eksport nie gubi treści odpowiedzi.
27. As a użytkownik interaktywnych odpowiedzi (widgetów), I want żeby w pliku pojawiła się ich tekstowa wersja Markdown, so that nie dostaję surowego kodu widgetu.
28. As a użytkownik, I want widoczny znacznik w pliku w miejscu treści typu, którego wtyczka nie obsługuje, so that wiem, że czegoś brakuje, zamiast dostać po cichu niepełną rozmowę.
29. As a użytkownik, I want żeby nazwa pliku pochodziła z tytułu Konwersacji, so that łatwo znajdę plik w Pobranych.
30. As a użytkownik, I want żeby nazwa pliku nie zawierała znaków niedozwolonych w systemie plików, so that pobieranie nie zawodzi na żadnym systemie.
31. As a użytkownik Konwersacji bez tytułu, I want rozsądną nazwę zastępczą pliku, so that plik i tak się zapisze.
32. As a użytkownik Projektów ChatGPT, I want móc eksportować Konwersacje wewnątrz Projektu, so that wtyczka działa wszędzie, gdzie rozmawiam.
33. As a użytkownik custom GPT, I want móc eksportować Konwersacje z custom GPT, so that nie ma wyjątków.
34. As a użytkownik, który kliknie ikonę na zwykłej stronie WWW poza Konwersacją ChatGPT (inna strona, strona główna ChatGPT, link `/share`), I want komunikat, że to nie jest Konwersacja do eksportu, so that wiem, dlaczego nic się nie pobrało.
35. As a użytkownik, który kliknie ikonę podczas generowania odpowiedzi, I want dostać eksport tego, co ChatGPT zdążył zapisać, so that kliknięcie nigdy nie jest zablokowane — wiedząc, że ostatnia odpowiedź może być wtedy niepełna.
36. As a użytkownik, który jest wylogowany, I want komunikat o problemie z autoryzacją, so that wiem, że trzeba się zalogować.
37. As a użytkownik, I want czytelny komunikat, gdy ChatGPT zmieni swoje API i eksport się nie uda, so that wiem, że trzeba zaktualizować wtyczkę, zamiast dostać pusty lub uszkodzony plik.
38. As a użytkownik, I want żeby wtyczka nie miała dostępu do stron, dopóki jej nie kliknę, so that nie daję jej szerszych uprawnień niż potrzeba.
39. As a użytkownik, I want żeby wtyczka nie wysyłała moich rozmów nigdzie poza moją przeglądarkę, so that moje dane zostają u mnie.
40. As a użytkownik, I want instalować wtyczkę przez „Load unpacked” bez kroku budowania, so that instalacja i aktualizacja to tylko przeładowanie katalogu.
41. As a developer wtyczki, I want żeby konwersja odpowiedzi API do Markdown była czystą funkcją, so that mogę ją testować bez przeglądarki.
42. As a developer wtyczki, I want testy uruchamiane jedną komendą `bun test`, so that szybko sprawdzę konwersję po zmianie formatu API.
43. As a developer wtyczki, I want fixture'y JSON odwzorowujące odpowiedź API, so that mogę dodać prawdziwą odpowiedź z DevTools, gdy coś się zepsuje.
44. As a developer wtyczki, I want żeby Bun był tylko narzędziem deweloperskim, so that wtyczka nie zależy od żadnego runtime'u ani zależności npm.

## Implementation Decisions

- **Platforma:** rozszerzenie Chromium w Manifest V3, czysty JavaScript, bez bundlera, TypeScriptu i zależności npm. Instalacja wyłącznie przez „Load unpacked”, bez publikacji w Chrome Web Store.
- **Uprawnienia:** tylko `activeTab` i `scripting`. Bez `host_permissions` i bez `downloads`. Dostęp do karty przyznaje kliknięcie ikony.
- **Moduły:**
  - **Background service worker** — nasłuchuje kliknięcia ikony i wstrzykuje do aktywnej karty kolejno moduł konwersji, a potem skrypt treści. Nie ma popupu. Błąd samego wstrzyknięcia (strony, na które przeglądarka nie pozwala wstrzykiwać, np. `chrome://`, Chrome Web Store) jest łapany i tylko logowany w konsoli workera — bez UI i bez dodatkowych uprawnień.
  - **Moduł konwersji** — czysta funkcja `conversationToMarkdown(conversationJson, conversationUrl) → { filename, markdown }`. Kontrakt: albo zwraca kompletny wynik, albo rzuca `Error` (patrz „Błędy struktury”); nigdy nie zwraca wyniku częściowego. Ładowany jako klasyczny skrypt (globalna funkcja) w przeglądarce i jako moduł w testach — przez warunkowy eksport zależny od środowiska. Jedyny moduł z logiką domenową.
  - **Skrypt treści** — wyciąga id Konwersacji z adresu, pobiera token, pobiera Konwersację z API, woła moduł konwersji, zapisuje plik przez Blob + link z atrybutem `download`. Wszystkie błędy (adres, autoryzacja, HTTP, wyjątek z modułu konwersji) obsługuje komunikatem `alert`; po błędzie nie zapisuje pliku.
- **Źródło danych (ADR 0001):** nieoficjalne wewnętrzne API ChatGPT, bez fallbacku ze scrapowania DOM.
  - Token: `GET /api/auth/session`, pole `accessToken`.
  - Konwersacja: `GET /backend-api/conversation/<id>` z nagłówkiem `Authorization: Bearer <token>`, fetch same-origin z content scriptu.
  - Tylko konta prywatne — bez nagłówka `Chatgpt-Account-Id` (Team/Business).
  - Gdy endpoint sesji zacznie zwracać 404, następnym krokiem jest przechwycenie Bearer tokena z requestów strony (MAIN world), nie DOM.
- **Rozpoznawanie Konwersacji:** id (UUID) wyciągane ze ścieżki pasującej do `/c/<id>` lub `/g/<gizmo-lub-projekt>/c/<id>`. Ścieżki `/share/...`, strona główna i czaty tymczasowe → komunikat „to nie jest Konwersacja”.
- **Kształt odpowiedzi API (istotne pola):** `title`, `current_node`, `mapping: { id → { id, parent, children, message } }`; `message.author.role`, `message.recipient`, `message.content.content_type`, `message.content.parts`, `message.metadata` (`is_visually_hidden_from_conversation`, `is_thinking_preamble_message`, `attachments`, `content_references`, `model_dil_v2.fallbackMarkdown`).
- **Wybór Gałęzi:** od `current_node` w górę po `parent` do korzenia, potem odwrócenie kolejności. Liczba kroków ograniczona do liczby węzłów w `mapping` — przekroczenie oznacza cykl i jest błędem struktury.
- **Błędy struktury** (moduł konwersji rzuca `Error`): brak `mapping`, brak `current_node` lub `current_node` nieobecny w `mapping`, `parent` wskazujący na węzeł nieobecny w `mapping` (urwany łańcuch), cykl. Wszystkie kończą się komunikatem „ChatGPT zmienił API, zaktualizuj wtyczkę”.
- **Filtrowanie wiadomości** — pomijane:
  - `author.role` = `system`,
  - `author.role` = `tool`, **chyba że** wiadomość zawiera obraz: `multimodal_text` z częścią `image_asset_pointer` (generator obrazów) albo `execution_output` z obrazem w `metadata.aggregate_result.messages` (wykres z code interpretera). Taka wiadomość jest renderowana wyłącznie jako placeholder(y) obrazu w sekcji „ChatGPT” — bez tekstu narzędzia i bez wyniku wykonania. Wiadomości narzędzia `file_search` pomijane zawsze,
  - `recipient` różny od `all`,
  - `content_type`: `thoughts`, `reasoning_recap`, `model_editable_context`, `user_editable_context`,
  - wiadomości z `is_visually_hidden_from_conversation` lub `is_thinking_preamble_message`,
  - puste odpowiedzi asystenta.
- **Scalanie:** kolejne wiadomości w Gałęzi renderowane jako „ChatGPT” (asystent oraz zachowane wiadomości narzędzi z obrazem) łączone w jedną sekcję „ChatGPT”.
- **Renderowanie treści:**
  - `text` — złączone `parts`; gdy istnieje `metadata.model_dil_v2.fallbackMarkdown`, używany zamiast `parts`.
  - `multimodal_text` — części tekstowe jako tekst, `image_asset_pointer` jako placeholder `[obraz: <nazwa>]` (wskaźniki `file-service://` i `sediment://`); brak nazwy → `[obraz]`.
  - `execution_output` (tylko w zachowanej wiadomości narzędzia) — placeholder `[obraz]` dla każdego obrazu.
  - `code` — blok kodu.
  - Załączniki z `metadata.attachments` jako lista `📎 <nazwa>` przy wiadomości użytkownika.
  - Nieznany `content_type` w wiadomości, która przeszła filtrowanie — znacznik `[Nieobsługiwana treść: <content_type>]` w miejscu treści. Eksport się nie przerywa.
- **Cytowania i referencje** (dla każdej wiadomości z `metadata.content_references`), w tej kolejności:
  1. Referencje typu `sources_footnote` nie są podmieniane w tekście.
  2. Referencje typu `url` oraz `client_defined_widget` z widgetem bloku kodu są pozostawiane bez zmian (ich treść jest już poprawnym Markdownem w tekście).
  3. Pozostałe referencje z niepustym `matched_text`, od najdłuższego `matched_text`: gdy referencja ma źródła (`items`, `supporting_websites`, `fallback_items`, `safe_urls`) — `matched_text` zastępowany linkami inline `([tytuł](url))`; gdy źródeł brak — zastępowany polem `alt` referencji (pusty `alt` → pusty tekst).
  4. Znaczniki linków inline z prywatnego zakresu Unicode (`url` + etykieta + adres) zamieniane na `[etykieta](adres)`.
  5. Na końcu usuwane pozostałe znaczniki cytowań z prywatnego zakresu Unicode.
- **Format pliku:** `# <tytuł>`, pusta linia, link do Konwersacji, potem naprzemiennie sekcje `## User` / `## ChatGPT`. Bez YAML frontmattera.
- **Nazwa pliku:** tytuł Konwersacji oczyszczony ze znaków niedozwolonych w nazwach plików, z rozszerzeniem `.md`; brak tytułu → nazwa zastępcza oparta o id Konwersacji.
- **Błędy:** nie-Konwersacja („to nie jest Konwersacja”), brak tokena / 401 („zaloguj się”), inny błąd HTTP lub błąd struktury z modułu konwersji („ChatGPT zmienił API, zaktualizuj wtyczkę”). Po błędzie nigdy nie pobieramy pliku.
- **Generowanie w toku:** stan generowania nie jest wykrywany (wymagałby odczytu DOM — patrz ADR 0001). Eksport obejmuje to, co zwraca API w chwili kliknięcia; ostatnia odpowiedź może być niepełna.

## Testing Decisions

- **Jeden seam testowy:** funkcja `conversationToMarkdown`. Testy sprawdzają wyłącznie jej wynik (`filename`, `markdown`) dla danego JSON-a — nie wewnętrzne kroki, nie prywatne helpery.
- **Narzędzie:** `bun test`, bez frameworków i dodatkowej konfiguracji. Bun tylko dev-owo.
- **Fixture'y:** najpierw syntetyczny JSON odwzorowujący kształt API, zawierający:
  - rozgałęzienie (edycja i regeneracja — sprawdzamy, że trafia tylko aktualna Gałąź),
  - wiadomość systemową, wiadomość ukrytą, `thoughts`,
  - wywołanie narzędzia bez obrazu (pominięte) oraz wiadomość narzędzia z wygenerowanym obrazem i z wykresem `execution_output` (placeholdery w sekcji „ChatGPT”, bez tekstu narzędzia),
  - kolejne fragmenty asystenta do scalenia,
  - obrazek użytkownika (`sediment://`) i załącznik,
  - cytowania: referencja ze źródłem (link inline), bez źródła z `alt` (tekst `alt`), referencja typu `url` i widget bloku kodu (treść nienaruszona), pozostały znacznik cytowania (usunięty), znacznik linku inline (link Markdown),
  - nieznany `content_type` (znacznik „Nieobsługiwana treść”),
  - widget z `fallbackMarkdown`,
  - tytuł ze znakami niedozwolonymi oraz brak tytułu.
- **Fixture'y błędów struktury:** brak `current_node`, urwany łańcuch `parent`, cykl — test sprawdza, że funkcja rzuca wyjątek (i się nie zawiesza).
- Później można dodać prawdziwą odpowiedź z DevTools jako kolejny fixture — przed nią syntetyczne fixture'y są tylko przybliżeniem kształtu API.
- **Dobry test:** porównuje oczekiwany fragment lub cały Markdown wyniku; zmiana implementacji bez zmiany wyniku nie psuje testu.
- **Bez testów automatycznych:** background worker, pobieranie tokena i fetch, zapis pliku — cienka warstwa nad API Chrome i ChatGPT. Sprawdzane ręcznie po „Load unpacked”:
  - eksport prawdziwej Konwersacji: zwykłej, w Projekcie, w custom GPT,
  - **zgodność Gałęzi z ekranem:** przełączenie wcześniejszego wariantu strzałkami `< >` bez wysyłania wiadomości, potem eksport — plik musi zawierać wariant widoczny na ekranie; to samo przy dwóch kartach tej samej Konwersacji z różnymi wariantami,
  - Konwersacja z wygenerowanym obrazem i z odpowiedzią z wyszukiwaniem w sieci,
  - kliknięcie na zwykłej stronie poza Konwersacją (alert) i na stronie `chrome://` (brak reakcji, wpis w konsoli workera).
- **Prior art:** brak — pusty projekt.

## Out of Scope

- Fallback ze scrapowania DOM.
- Konta Team / Business / Enterprise.
- Eksport wszystkich Gałęzi lub wielu Konwersacji naraz.
- Linki `/share/...` i czaty tymczasowe.
- Pobieranie bajtów obrazków i plików (base64, ZIP z assetami).
- Wywołania narzędzi, tekstowe wyniki code interpretera, treść rozumowania modelu (obrazy z narzędzi tylko jako placeholdery).
- Wykrywanie trwającego generowania odpowiedzi.
- Komunikat dla użytkownika na stronach, na które przeglądarka nie pozwala wstrzykiwać skryptów (`chrome://`, Chrome Web Store).
- YAML frontmatter (URL, daty, model).
- Popup, strona opcji, przycisk wstrzykiwany w stronę.
- Publikacja w Chrome Web Store, wsparcie Firefoxa.
- Krok budowania, TypeScript, zależności npm.

## Further Notes

- Decyzja o źródle danych: `docs/adr/0001-backend-api-bez-fallbacku-dom.md`. Słownik pojęć: `GLOSSARY.md`.
- API jest nieoficjalne; regulamin OpenAI zabrania programowego wyciągania danych — ryzyko zaakceptowane dla ręcznego, osobistego eksportu.
- Wzorce kształtu API i obsługi cytowań: pionxzh/chatgpt-exporter (`src/api.ts`, `src/exporter/markdown.ts`, `src/utils/citations.ts`), stan 2026-10.
- Jedno kliknięcie = jedno zapytanie o sesję + jedno o Konwersację — daleko od zgłaszanych limitów API.
- **Znane ryzyko — `current_node` a ekran:** zweryfikowano ręcznie 2026-10-31 (przełączenie wariantu `< >`, dwie karty) — eksport odpowiadał ekranowi. Pierwotnie nie było pewne, że `current_node` z API zawsze wskazuje Gałąź widoczną na ekranie (np. po przełączeniu wariantu bez wysłania wiadomości lub przy dwóch kartach). Weryfikuje to test ręczny. Jeśli się nie potwierdzi, rozważymy wybór liścia Gałęzi na podstawie id ostatniej widocznej wiadomości — to wymagałoby ograniczonego odczytu DOM i aktualizacji ADR 0001.
- Recenzja spec: niezależna analiza (GPT-6.1 Sol, 2026-10-31) wskazała filtr narzędzi gubiący obrazy, zbyt szeroką regułę cytowań, ciche pomijanie nieznanych treści, ryzyko `current_node`, generowanie w toku i błędy wstrzyknięcia — wszystkie uwzględnione powyżej.
