# Current presentation scope

The user subsequently requested a shorter presentation. The current panel has three views and two main panels per view. The seven-view exploration and derived-comparison UI described below are historical and have been removed from the visible interface. Source data and aggregate export remain available. Current browser evidence is in .impeccable/review/presentation/.

# Research dashboard UX and data audit

Date: 2026-11-01. Audience: public readers. Scope: all seven views, both themes, navigation, filtering, explanations, chart interpretation and export. This pass preserves the existing glass visual system and original CSV.

## Findings and implemented improvements

| Before | After | Why |
| --- | --- | --- |
| Fixed desktop sidebar | Persistent 76px icon rail with named links, tooltips and an expand control | Gives charts more room without losing wayfinding |
| Browser-native select menus | Actual shadcn/Radix selects with themed popup, selected state, keyboard support and scrolling | The menu now follows the panel in both themes |
| Active filters visible only as a count | Removable labelled filter chips, total selected count and clear-all | Readers can see what changed their sample |
| Population rules mostly behind methodology | Visible page population plus contextual information bubbles | Explains why 126 respondents and 108 AI users are different bases |
| Limited help on measures | Source-question, answered/missing and calculation explanations; hover, focus and tap support | Readers can inspect meaning without leaving the chart |
| Repeated bar-only presentation | Appropriate stacked proportions, histogram, co-use matrix and mean-score dot plots | Different questions receive appropriate visual forms |
| No picture of multi-tool behavior | Tool-count distribution and top-six co-selection matrix | Shows overlap without mislabelling survey choices as market share |
| Separate demographic and usage totals | AI status within each occupation group | Makes comparison possible while preserving each group's denominator |
| Trust shown only as an overall average | Frequency/plan comparisons with valid-answer counts and small-group labels | Exposes variation without claiming significance or causation |
| Social choices only as overall totals | User versus other-respondent comparison for the three social questions | Distinguishes group composition from population-wide conclusions |
| Sample limits easy to overlook | Dynamic largest-age-group panel and national-representativeness explanation | Makes the heavily young sample visible before generalizing |
| Frequency/age/experience ordered primarily by count | Ordinal distributions follow their natural sequence | Avoids implying that unrelated rank positions form a progression |
| Refresh also forced every subsequent filter change to refetch the source | Explicit refresh bypasses cache once; filters reuse the cached source | Avoids unnecessary remote-source reads |
| CSV contained basic distributions only | Localized questions and derived comparisons, with count/base/percentage/mean columns | Makes the displayed analysis reviewable outside the panel |
| Trust accepted any numeric source value | Values outside 1–5 are excluded from mean calculations and marked missing | Keeps invalid values out of the stated rating scale |
| Tiny supporting labels and inconsistent motion rules | Reinforced chart captions and specific short button transitions; data bars update without animation | Improves reading and repeated interaction |

## Filter decision

Retain age, occupation, field and AI-use status. Each changes a meaningful research population, and all four apply across views and export. Keep them behind the labelled Filters disclosure to avoid crowding the default reading view. All selections apply together. An active-user view filtered to nonusers explains why its questions have no eligible answers and offers removal of that status filter. Search and table sorting affect only the tool table, which its help explicitly explains.

## Coverage of the CSV

All 20 substantive survey questions remain represented; timestamp is used only as source recency. Conditional tool, purpose, frequency, experience, plan, trust and behavior questions use selected active users. Age, gender, occupation, field, use status, social choices, perceived intelligence and willingness to pay use all selected respondents.

New analyses are derived from these existing answers rather than invented variables. Tools and purposes remain deduplicated per respondent. The co-use matrix counts the intersection of two sets of respondents; diagonal cells show the tool's own total, and the symmetric cells must not be added. Tool breadth counts categories, including the bundled creative/other categories, rather than claiming a precise number of branded applications.

The source inspected in this pass has 126 respondents and 108 AI users. Among AI users, 93 report daily use, 22 use a paid plan, 99 selected at least two tool categories and 66 assign trust 4 or 5. The co-use intersection for ChatGPT and Gemini is 89 respondents. These are sample descriptions, not national estimates.

## Verification and boundaries

The production TypeScript/Vite build and eight API/data regression tests pass. Browser checks cover all seven views in both themes at 1440px and 390px, plus overflow checks at 320px, 768px and 1024px; additional checks cover minimized-navigation persistence, help, custom selects, filters, table search/sort, export, methodology, refresh, mobile navigation and failure/recovery. Exact results and screenshots are in `.impeccable/review/`. No browser page errors were reported. The source detector returned no findings.

These checks use local Chromium, not physical phones, Safari certification, remote deployment or human comprehension studies. An independent finish reviewer examines the final captures and semantic changes. No source respondent rows are sent to the browser or included in CSV export. Character artwork remains pending the user-supplied images. The main JavaScript bundle still has Vite's size advisory; no real-network performance score is claimed.

## Independent finish review

Final disposition: ship at fix-list scope. All 43 browser checks and eight API/data tests pass. The independent reviewer found two material color-interpretation issues; both were corrected and scored resolved on fresh light/dark captures.

| Before | After | Why |
| --- | --- | --- |
| Adoption colors depended on the remaining filtered row order | Both segments and legend map status to stable colors: Bəli lavender, heard/no use mint, Xeyr amber | Selecting only nonusers now keeps Xeyr amber in both themes |
| Co-use legend described darker cells as larger values | Caption describes stronger lavender intensity | Correctly explains the matrix in both themes |
