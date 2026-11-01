# Azərbaycanda AI istifadəsi

Public research dashboard in Azerbaijani, rebuilt with React, semantic HTML, TypeScript, Vite, Tailwind CSS and real shadcn/ui components. Lucide supplies the interface icons. A Python same-origin API reuses the survey normalization and calculations.

## Run the complete website

Requires Node.js 22.12+ and Python with the dependencies in requirements.txt.

```powershell
npm install
pip install -r requirements.txt
npm run build
python app.py
```

Open http://127.0.0.1:8000. This serves both the built React website and its API. The former Streamlit interface is replaced. Do not start this version with streamlit run app.py.

For development, keep `python app.py` running and run `npm run dev` in another terminal. Open http://127.0.0.1:5173; Vite proxies /api to the Python server.

## What is included

A concise three-view presentation in Azerbaijani:

1. **Ümumi mənzərə**: sample size, adoption, average trust, daily use and willingness to pay.
2. **Alətlər və məqsədlər**: three ranked tool cards, the complete tool comparison, and four main purposes.
3. **Etibar və seçimlər**: trust distribution and the three social choices.

Each view keeps its short main presentation, with Back/Next controls and a 1/3–3/3 sequence. The tools view leads with the three ranked logo cards and places the complete eight-row comparison below them. A closed-by-default Bütün cavablar disclosure in each view makes every response category of all 20 substantive survey questions available without adding navigation sections. Both themes, persistent minimized sidebar, optional styled filters, contextual help, refresh and full aggregate CSV export remain available. Former seven-view links map to their consolidated destinations. No character artwork is used in the presentation layout. The earlier expanded exploration was intentionally removed from the visible interface for a short presentation; its aggregate calculations remain in the CSV export.

## Data and calculations

Local data.csv is the default. Set CSV_URL to a published Google Sheets CSV URL to use live data; existing .streamlit/secrets.toml CSV_URL remains supported by the retained loader. Cached source data expires after 60 seconds; the refresh control explicitly reloads it. Browser clients receive only aggregates, never individual records.

All active-user questions use the filtered AI-user denominator. General questions use the full filtered denominator. Tool and purpose answers are deduplicated per respondent. Every chart displays its base. Group comparisons calculate within each group. Average trust uses valid numeric answers only; no active answers displays an em dash. Small samples are marked. The supplied source has 126 total responses, 108 AI users, 105 ChatGPT selections and mean trust 3.5648/5. The original screenshot's 3.42 was not used.

The CSV download contains localized questions, aggregate counts, bases, percentages and mean scores for distributions and derived comparisons under the current filters. Co-use export includes each pair once. It does not contain individual responses. This is a convenience survey; no national representativeness or confidence claim is made.

## Character images

The presentation layout has no character-image placements. CHARACTER-ASSETS.md describes the earlier exploratory version and is not a required delivery list for the current interface.

## Verification

```powershell
python -m unittest test_dashboard_api.py
python test_app_logic.py
npm run build
```

scripts/verify-ui.mjs checks all three views in both themes at desktop/mobile sizes, the presentation sequence, actual source counts, legacy links, sidebar persistence, optional filtering, CSV export and overflow at 320/768/1024px. It connects to a running Chromium endpoint via CDP_URL; start the application first. Captures and the 22-check report are in .impeccable/review/presentation/. These are local checks, not hosted or real-device certification.

## Project structure

- src/: React application, glass theme tokens, shadcn/ui components.
- app.py / server.py: Python launcher, aggregate API, production static host.
- data_utils.py: retained source normalization and calculations.
- analytics.py: descriptive group comparisons, ordered categories and deduplicated tool co-use.
- public/logos/: bundled SVG marks, with provenance in ASSET-SOURCES.md.
- public/characters/: user-supplied artwork after approval.
- charts.py / ui.py / icons.py: legacy helpers retained for original calculation checks; not loaded by the React website.
- DESIGN.md / PRODUCT.md: design system and product constraints.

## Hosting

Deploy the compiled dist/ directory with server.py, app.py, data_utils.py, requirements.txt, data.csv and any configured data-source credentials. For a hosted process set HOST=0.0.0.0 and PORT to the platform's assigned port. Use the platform's HTTPS reverse proxy. Streamlit Community Cloud is not a hosting target for this React/Python version. No remote deployment was performed.

All tool names and marks belong to their respective owners and identify survey choices. Category icons are not company marks.
