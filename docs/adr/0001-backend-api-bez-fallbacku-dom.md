# Eksport z wewnętrznego API ChatGPT, bez fallbacku z DOM

Konwersację pobieramy przez nieoficjalne `GET /backend-api/conversation/<id>` (token z `/api/auth/session`), bo zwraca całą Konwersację z treścią już w Markdown. Świadomie nie ma fallbacku ze scrapowania DOM: od redesignu ChatGPT (~2026-09) lista wiadomości jest wirtualizowana (montowane tylko tury blisko viewportu, starsze doładowywane), ukryte kopie poprzednich rozmów zostają w DOM, a selektory zmieniły się dwa razy w jednym miesiącu — fallback byłby większy i bardziej kruchy niż cały eksporter. Utrzymywane exportery (pionxzh/chatgpt-exporter, stan 2026-10) też nie scrapują DOM. Przy błędzie API pokazujemy czytelny komunikat; jeśli `/api/auth/session` zacznie zwracać 404, tańszym zabezpieczeniem jest przechwycenie Bearer tokena z requestów strony (MAIN world), nie DOM.

## Consequences

- Wtyczka przestanie działać, gdy OpenAI zmieni kształt odpowiedzi API — naprawa to aktualizacja konwersji, nie przepisanie.
- Regulamin OpenAI zabrania programowego wyciągania danych; akceptujemy to ryzyko dla ręcznego, osobistego eksportu.
- Obsługujemy tylko konta prywatne (bez nagłówka `Chatgpt-Account-Id` dla Team/Business).
