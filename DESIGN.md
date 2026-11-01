---
name: "Azərbaycanda AI istifadəsi"
description: "A full-viewport three-step survey presentation with a white daylight workspace and dark lavender glass."
colors:
  "light-bg": "#f4f6fa"
  "light-shell": "#f4f6fa"
  "light-sidebar": "#ffffff"
  "light-panel": "#ffffff"
  "light-text": "#182234"
  "light-muted": "#596579"
  "light-lavender": "#6844c4"
  "light-mint": "#08785e"
  "light-amber": "#89610a"
  "light-blue": "#3568b5"
  "light-pink": "#a64072"
  "light-line": "#dfe5ee"
  "light-track": "#edf0f6"
  "light-popover": "#ffffff"
  "light-edge": "#e4e9f1"
  "light-glass-tint": "#efebfa"
  "light-glass-strong": "#e3daf6"
  "dark-bg": "#201b31"
  "dark-shell": "#090912"
  "dark-sidebar": "rgba(11, 11, 20, 0.84)"
  "dark-panel": "rgba(19, 19, 32, 0.78)"
  "dark-text": "#f3f1f8"
  "dark-muted": "#a5a1b7"
  "dark-lavender": "#baa6fb"
  "dark-mint": "#44e8b8"
  "dark-amber": "#efcc66"
  "dark-blue": "#80adf7"
  "dark-pink": "#e39dc1"
  "dark-line": "rgba(222, 211, 255, 0.105)"
  "dark-track": "rgba(204, 192, 244, 0.08)"
  "dark-popover": "#1b192a"
  "dark-edge": "rgba(232, 220, 255, 0.16)"
  "dark-glass-tint": "rgba(117, 83, 202, 0.12)"
  "dark-glass-strong": "rgba(155, 118, 236, 0.31)"
  "light-primary-ink": "#ffffff"
  "dark-primary-ink": "#211535"
  "destructive": "#c8435b"
  "light-control-border": "#d7deea"
  "light-nav-text": "#526076"
  "light-selected-text": "#4e2d9b"
  "light-control-text": "#27334b"
  "light-control-quiet": "#46546c"
  "light-data-bar": "#7856cd"
  "light-primary-hover": "#5735ae"
  "light-chip-fill": "#f0ebfb"
  "light-chip-border": "#dcd1ef"
typography:
  "headline":
    fontFamily: "'Manrope Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "30px"
    fontWeight: 680
    lineHeight: 1.3
    letterSpacing: "-0.03em"
  "metric":
    fontFamily: "'Manrope Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "35px"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.035em"
  "title":
    fontFamily: "'Manrope Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "14px"
    fontWeight: 650
    lineHeight: 1.5
    letterSpacing: "-0.015em"
  "body":
    fontFamily: "'Manrope Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.55
  "label":
    fontFamily: "'Manrope Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
  "fact":
    fontFamily: "'Manrope Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "31px"
    fontWeight: 600
    letterSpacing: "-0.03em"
  "dark-headline":
    fontFamily: "'Manrope Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "27px"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "-0.035em"
  "dark-title":
    fontFamily: "'Manrope Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "-0.015em"
rounded:
  "field": "8px"
  "control": "10px"
  "utility": "11px"
  "filter-panel": "14px"
  "compact-card": "17px"
  "mobile-panel": "18px"
  "dialog": "20px"
  "panel": "22px"
  "select-trigger": "9px"
  "select-popup": "12px"
  "select-item": "7px"
spacing:
  "7": "7px"
  "8": "8px"
  "10": "10px"
  "11": "11px"
  "12": "12px"
  "13": "13px"
  "15": "15px"
  "16": "16px"
  "17": "17px"
  "18": "18px"
  "20": "20px"
  "21": "21px"
  "22": "22px"
  "23": "23px"
  "24": "24px"
  "26": "26px"
  "29": "29px"
  "32": "32px"
components:
  "button-primary":
    backgroundColor: "{colors.light-lavender}"
    textColor: "{colors.light-primary-ink}"
    rounded: "{rounded.control}"
    height: "36px"
    padding: "8px 16px"
  "button-outline":
    backgroundColor: "{colors.light-popover}"
    textColor: "{colors.light-control-quiet}"
    rounded: "9px"
    height: "34px"
    padding: "0 13px"
  "button-ghost":
    textColor: "{colors.light-muted}"
    rounded: "{rounded.control}"
  "navigation-item":
    textColor: "{colors.light-nav-text}"
    rounded: "{rounded.control}"
    padding: "12px 13px"
    size: "46px"
  "tag":
    backgroundColor: "{colors.light-chip-fill}"
    textColor: "{colors.light-selected-text}"
    rounded: "{rounded.field}"
    padding: "6px 9px"
  "panel":
    backgroundColor: "{colors.light-panel}"
    textColor: "{colors.light-text}"
    rounded: "{rounded.mobile-panel}"
    padding: "26px"
  "data-bar":
    backgroundColor: "{colors.light-track}"
    rounded: "4px"
    height: "7px"
  "select-trigger":
    backgroundColor: "{colors.light-popover}"
    textColor: "{colors.light-control-text}"
    rounded: "{rounded.select-trigger}"
    padding: "8px 11px"
    height: "40px"
  "select-popup":
    backgroundColor: "{colors.light-popover}"
    textColor: "{colors.light-text}"
    rounded: "{rounded.select-popup}"
  "info-bubble":
    backgroundColor: "{colors.light-popover}"
    textColor: "{colors.light-text}"
    rounded: "{rounded.filter-panel}"
    padding: "18px"
    width: "min(340px, calc(100vw - 32px))"
  "presentation-navigation":
    textColor: "{colors.light-muted}"
    padding: "19px 0 0"
---

# Design System: Azərbaycanda AI istifadəsi

## Overview

**Creative North Star: "Lavender Glass Research Workspace"**

A full-viewport three-step presentation pairs an ink shell and lavender glass in dark mode with a neutral canvas and crisp white surfaces in daylight. Both modes share navigation, panel composition and chart meaning. Daylight relies on fine slate borders and restrained purple emphasis; dark mode retains its translucent layers, edge highlights and established palette. The shell fills the viewport without an inset collage frame.

The Azerbaijani sequence is Ümumi mənzərə, Alətlər və məqsədlər, then Etibar və seçimlər. Each view contains two main panels; the first also includes three core metrics, and the tools view adds a row of the top three ranked tool cards above its complete comparison table. Closed-by-default answer disclosures preserve access to all twenty substantive questions without lengthening the initial presentation. A numbered Back/Next flow supports timed delivery. Optional filters, methodology and contextual help remain available without expanding the default narrative. No character artwork is rendered or needed.

**Key Characteristics:**
- Shared full-viewport geometry with distinct white daylight and dark glass materials.
- Three steps, two main panels per view, top-three tool cards and concise supporting notes.
- Direct values and denominator bases beside actual survey charts.
- Persistent optional 76px desktop rail and contextual help.

## Colors

The frontmatter preserves the literal CSS palette, including alpha colors. Light and dark counterparts map to the same CSS roles; theme changes do not alter analytical meaning.

### Primary

**Lavender** supplies actions, active icons, focus and large observation values. Light horizontal bars use the separate data-bar purple; dark bars retain their lavender gradient. Primary ink is white in daylight and deep plum in dark mode. Use the theme-specific ink on lavender buttons.

### Secondary

**Mint** marks the adoption metric and the heard-but-not-used status. **Amber** marks the trust metric, small-sample caution and nonuser status. These roles are distinguished by labels as well as color.

### Tertiary

**Blue** and **pink** remain available in the inherited categorical palette; the current presentation does not require extra categorical series. Destructive rose is a shared-library state, not a new presentation action.

### Neutral

In daylight, **background** and **shell** share a neutral cool canvas; **sidebar**, **panel** and **popover** are white. Dark mode keeps the lavender outer background, ink shell and translucent sidebar/panel materials. Daylight uses slate **text** and **muted** roles for reading contrast. **Text** carries the main reading; **muted** carries supporting labels and bases. **Line** separates rows and controls, **track** backs bars and controls, and opaque **popover** supports readable menus and help. **Edge**, **glass tint** and **glass strong** create material highlights.

**The Same Meaning Rule.** Status colors remain lavender for active users, mint for heard-but-not-used and amber for nonusers, even when filters remove a category.

## Typography

All roles use self-hosted Manrope Variable with system sans-serif fallbacks and Latin Extended coverage for Azerbaijani. Frontmatter body, headline, title, metric and fact roles describe the built hierarchy. Tabular figures stabilize values, percentages and progress.

Light page headings use 30px at weight 680 with -0.03em tracking, becoming 26px on mobile. Dark headings remain 27px at weight 650, becoming 25px on mobile. Light panel titles use 14px at weight 650, becoming 13px on mobile; dark panel titles remain 14px at weight 600, becoming 13px at 1100px and below. Bar labels use 12px and denominator captions use 11px. The two overview observations use the fact role, reducing to 28px on mobile; their labels use 14px at weight 600 in light mode and 550 in dark mode and explanatory lines use 12px at 1.8 line height. Presentation notes use 12px, reducing to 11px on mobile, with a 90ch maximum. Metrics use 35px base values, 38px on large desktop and the existing compact mobile sizing.

## Layout

The app frame fills the viewport at every breakpoint: width 100%, no maximum width, minimum height 100dvh, zero outer margin, border, outline and corner radius. The sidebar fills 100dvh. The expanded sidebar remains 222px, 200px at 1240px and below, and 185px at 1000px and below. Header height remains 83px, or 87px from 1500px upward. Content gutters are 32px, becoming 24px at 1240px and 20px at 1000px. Large-screen outer mats and the bordered collage silhouette are removed in both themes.

From 761px upward, minimizing navigation produces a 76px rail with 12px horizontal padding and centered named destinations. The expansion preference persists locally; absent a saved preference, it starts expanded. At 760px and below navigation becomes a 245px drawer with full labels, scrim, Escape dismissal, focus containment and an inert workspace. The full-viewport frame remains; header height is 70px and main padding is 25px 20px 0. Minimum body width is 320px.

Overview and trust use two equal presentation columns with a 22px gap and 26px panel padding. Tools starts with exactly three ranked podium cards in one desktop row, followed by a full-width comparison table and then a full-width purpose panel; it is not an eight-card grid. The podium row uses three equal columns with a 20px gap, reducing to a stacked column at 760px and below. The table preserves all eight source tool/category rows, uses a 660px minimum width and scrolls locally on narrow screens. At 1000px and below the gap is 18px and panel padding 21px; columns stack only at 760px and below. Chart rows have 29px gaps, becoming 24px on mobile. The overview retains three metric cards, with the third spanning the second mobile row. Its donut is 185px wide. The two observation blocks have a 23px gap and a fine divider. Back/Next sits beneath the note, with 26px top margin and a 19px inset above its divider. Progress runs from 1 / 3 through 3 / 3.

Filters remain initially hidden. Their four controls wrap when revealed; active chips and the visible population strip explain the selected sample. The trust view has mixed populations, so its individual panels and note state the bases rather than relying only on the page strip.

## Elevation & Depth

Daylight uses flat white panels, metrics and podiums with a full 1px line border and no ambient card shadow. Its header is frosted white at 0.88 alpha with 22px blur and 150% saturation. Menus use `0 12px 32px -14px #20304e55`; help and methodology use `0 16px 48px -20px #20304e60`, both on near-opaque white. Podiums retain only local low gold, lavender and pink tints. Light navigation selection is flat pale lavender with no inset shadow.

Dark mode preserves translucent panels, radial tints, inset edges and `0 10px 30px -22px rgba(0,0,0,.7)` panel shadow. Dark help and select popovers retain `0 12px 35px -12px #0007`. Dark header blur remains 20px; mobile drawer blur 28px and scrim blur 3px. The shared full-viewport geometry is the only change to the dark shell in this revision.

Shared buttons explicitly transition color, background, shadow and transform over 160ms using `cubic-bezier(.23,1,.32,1)`; other links and buttons retain the base 180ms ease color/background/shadow treatment. Pressed buttons scale to 0.98. Data-bar widths update immediately, and trust chart animation is disabled. Refresh dims data over 150ms and uses a 1.2s linear spin. Reduced motion removes animation; reduced transparency makes shell layers opaque; increased contrast strengthens captions and dividers.

**The Quiet Material Rule.** White daylight surfaces and dark glass support the short presentation; neither may compete with labels or become a decorative data signal.

## Shapes

The shell has no outer corners or decorative frame. Daylight panels, metrics and podiums use 18px corners. Dark desktop panels and podiums retain 22px corners, mobile panels 18px and compact metrics 17px. Controls use 8–11px corners according to the frontmatter; menus use 12px and help bubbles 14px. Bars use 4px rounded tracks, while status dots and donut geometry stay circular. SVG tool marks sit on white 32px tiles with 10px corners; podium cards use the large 48px tile with 14px corners, compacted by the existing responsive podium rules. No illustration container or character placement belongs to the current presentation.

## Components

### Presentation navigation

The sidebar contains exactly three destinations: Ümumi mənzərə, Alətlər və məqsədlər, and Etibar və seçimlər. Named links, current-page state and tooltips preserve orientation in the minimized rail. A separate progress row provides Geri and Növbəti actions; hide Back on the first step and Next on the last. Legacy hashes map into this three-view sequence rather than restoring removed screens.

### Buttons

Primary actions use lavender with theme-specific primary ink. Daylight export and Next use solid purple with white text and a deeper purple hover; utility and filter controls use white fill, fine cool borders and slate text. Dark action styling remains unchanged. Default shared sizing is 36px high with 8px 16px padding, reduced horizontal padding beside icons. Export uses a compact utility treatment. Filters use a quiet outline and track fill; Back and methodology use ghost styling. Focus remains visible and disabled buttons dim. Mobile utility buttons are 40px, the menu opener is 44px high and filters have a 40px minimum height.

### Inputs / Fields

Only optional filters need selects; there is no tool-search or sorting interface. All filter menus use Radix/shadcn: opaque popover fill, 9px trigger corners, 40px height and 8px 11px padding. Popup width follows its trigger and is capped at viewport minus 28px; it has 12px corners, at most 320px available height, a scrolling viewport and 5px inset. Items use 7px corners, minimum 37px height and 8px 28px 8px 10px padding. Highlighted/selected items use glass tint with a lavender check. Mobile triggers and items have a 44px minimum; triggers use 16px type. Daylight trigger text is deep slate, borders are cooler than the default line, and opening adds a restrained purple 3px ring. The light popup is near-opaque white with pale lavender selected rows, darker purple text and a lavender check. Preserve keyboard navigation and selection semantics.

### Chips and help

Active filter chips use 8px corners, 6px 9px padding and 11px type with labelled removal. Daylight uses a pale purple chip fill, soft purple border and dark selected text; dark mode retains glass tint and line roles. Help uses a quiet 27px question trigger and an opaque bubble at most 340px wide or viewport minus 32px, with 18px padding, 14px corners and 12px type at 1.8 line height. Hover or focus opens it; tap/click pins it. Pointer leave waits 120ms when unpinned. Use help for definitions and calculation details while preserving visible values and bases. Methodology holds the longer explanation.

### Cards / Containers

Daylight panels and metrics use white fill, a complete fine border and no shadow. Their icons use pale lavender, mint and amber tiles; metric circular decorations are hidden. Dark panels retain translucent fill, a top edge and diffuse shadow, while dark metrics keep tone tints and circular outlines. The two observations are text blocks inside one main panel, not additional cards. The top-three tool podiums retain 24px padding; daylight uses 18px white bordered surfaces and dark mode uses 22px glass surfaces. Both use a subtle local lower tint; first place uses amber, second lavender and third pink. Each has rank, context tag, SVG logo, name/company, percentage and count/base. No character artwork is included. No sidebar research promotion, long findings, matrix, histogram or derived-comparison chart is rendered.

### Data presentation

Overview pairs an adoption donut with two observations: daily use among AI users and the 0 AZN monthly-budget choice among all respondents. At the inspected unfiltered source these are 93 / 108 and 50 / 126; rendered values must remain bound to current data and filters. The three core metrics show participants, adoption and mean trust. A short note states sample composition and the representativeness limit.

Tools shows the top three ranked choices as podium cards above the complete eight-row tool comparison table, then the top four purposes as directly labelled horizontal bars. The table retains logo, company/category, count/base and percentage with a miniature bar for every tool/category; it has no search or sorting controls. Tools and purposes are multiple-choice questions; totals may exceed 100%. Trust pairs the discrete 1–5 rating distribution and its numeric alternative with three separate social-choice measures: choosing a human doctor, choosing a teacher and viewing AI as a friend. These three questions must not be summed. Mean trust uses valid AI-user ratings; social choices use all respondents. Visible labels and a short note explain this distinction.

Loading dims existing data; empty states use a clear message and errors provide retry. Full CSV export retains the broader source analyses as aggregate data. The default presentation selects the main findings, while a closed-by-default Bütün cavablar disclosure on each view exposes every substantive source question: five on overview, five on tools and ten on trust. Every answer category retains its count, base and percentage, with eligible population, answered/missing totals and multiple-choice notes. Timestamp remains recency metadata. The disclosure resets closed when changing views; complete question coverage does not require extra navigation destinations.

### Complete-answer disclosure

Use the native details/summary interaction with a concise question count beneath its title, a chevron that rotates when open and fine dividers above and below. Summary padding is 18px 1px. Expanded questions form two columns with a 28px gap, becoming one column with a 30px gap on mobile. Tables use a fixed layout and wrapping answer labels; the first column is 60%, or 54% on mobile. Daylight expands each question into a white, bordered 14px-radius container with 20px padding, reducing to 16px on mobile; dark questions retain their original unboxed presentation. Daylight question headings use 14px, reducing to 13px on mobile. The disclosure is supplementary detail, not an automatically expanded presentation section.

### Assets

Use existing bundled tool SVG marks and Lucide SVG icons; ASSET-SOURCES.md records their provenance and the self-hosted font. No character art or new raster imagery is rendered or needed.

## Do's and Don'ts

### Do:
- Do use full-viewport geometry in both themes and preserve semantic chart roles.
- Do use flat white bordered daylight cards while retaining the established dark glass styling.
- Do keep three presentation views, two main panels per view and the top-three tool row above the full comparison table.
- Do preserve all twenty questions and all answer categories in closed-by-default per-view disclosures.
- Do show counts and denominator bases beside percentages, and identify small samples.
- Do retain the three-step Back/Next flow with visible progress.
- Do keep detailed explanations in optional help and methodology.
- Do use Azerbaijani labels, bundled SVG marks and visible keyboard focus.

### Don't:
- Don't use emoji as interface icons.
- Don't restore an inset outer collage frame or apply the daylight card treatment to dark mode.
- Don't invent curves, trends, percentages or nationally representative claims.
- Don't replace the top-three podium row and complete tool table with an eight-card grid.
- Don't restore matrices, comparison pages, search controls or long findings to the default presentation.
- Don't animate changing data-bar widths or replace missing results with invented values.
- Don't add character illustrations or raster images to fill presentation space.
