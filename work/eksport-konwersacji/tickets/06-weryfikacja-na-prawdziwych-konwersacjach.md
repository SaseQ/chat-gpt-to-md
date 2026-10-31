# 06: Weryfikacja na prawdziwych Konwersacjach

**What to build:** Potwierdzenie na koncie użytkownika, że Eksport działa na prawdziwych Konwersacjach, a syntetyczne fixture'y odpowiadają rzeczywistemu kształtowi API. Rozstrzygnięcie znanego ryzyka: czy `current_node` z API zawsze wskazuje Gałąź widoczną na ekranie. Wymaga zalogowanego konta ChatGPT, więc wykonuje go człowiek (agent może przygotować listę kroków i dopisać fixture z dostarczonego JSON-a). Szczegóły: spec, „Testing Decisions” (testy ręczne) i „Further Notes” (Znane ryzyko — `current_node` a ekran).

**Blocked by:** 02 (Czytelne błędy zamiast cichej porażki), 03 (Eksport zawiera tylko faktyczną rozmowę), 04 (Obrazki i załączniki jako placeholdery), 05 (Cytowania jako linki inline)

**Status:** needs-human

- [ ] Eksport zwykłej Konwersacji, Konwersacji w Projekcie i w custom GPT daje poprawny plik.
- [ ] Konwersacja z wygenerowanym obrazem daje placeholder obrazu w sekcji „ChatGPT”.
- [ ] Konwersacja z wyszukiwaniem w sieci daje linki inline do źródeł i brak śmieciowych znaków.
- [ ] Po przełączeniu wcześniejszego wariantu strzałkami `< >` bez wysyłania wiadomości plik zawiera wariant widoczny na ekranie.
- [ ] Przy dwóch kartach tej samej Konwersacji z różnymi wariantami każda karta eksportuje swój widoczny wariant — lub wynik jest odnotowany jako ograniczenie.
- [ ] Kliknięcie na zwykłej stronie poza Konwersacją pokazuje alert; na stronie `chrome://` brak reakcji i wpis w konsoli workera.
- [ ] Prawdziwa odpowiedź API z DevTools (bez wrażliwych treści) dodana jako fixture; `bun test` przechodzi także na niej.
- [ ] Jeśli `current_node` nie odpowiada ekranowi: wynik zapisany w spec, a decyzja o odczycie id widocznej wiadomości z DOM zgłoszona do aktualizacji ADR 0001.
