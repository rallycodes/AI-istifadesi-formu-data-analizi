# Azərbaycanda AI istifadəsi

<!-- impeccable:product-schema 1 -->

## Platform
web

## Stack
User-requested React, semantic HTML and shadcn/ui. Vite frontend with the existing Python survey processing retained behind a same-origin API.

## Product Purpose
Explore the supplied Azerbaijani AI-use survey through summaries, tools, habits, trust, demographics, social choices and group comparisons.

## Users
Confirmed by the user: public research readers exploring the results.

## Capabilities and Constraints
Preserve Azerbaijani content and source data. Active-user questions use the filtered active-user base; general questions use all filtered respondents. Multiple-choice selections are deduplicated per respondent. Small samples must be identified. Do not represent a convenience survey as nationally representative. No fabricated trends or statistics.

## Brand Commitments
The user supplied two binding dashboard references: dark glass, lavender accents, compact navigation, professional iconography, and equivalent light mode. No emoji. Character assets will be created by the user in AI Studio; provide prompts and placements, and do not fabricate finished assets.

## Evidence on Hand
data.csv has 126 responses and 108 active AI users at inspection. Existing data_utils.py provides normalization, deduplicated choices, KPIs and findings. Existing assets/logos contains tool SVGs. Existing screenshot app_render_main.png documents the rejected Streamlit presentation.

## Product Principles
Show denominators. Keep comparisons honest. Preserve source records. Give every analysis a readable, accessible presentation.

## Presentation scope

The user will present with limited time. The current interface intentionally has three concise views: overview, tools and purposes, trust and social choices. Each has two main panels. Detailed exploratory comparisons and repeated explanations are removed from the visible flow. Full source aggregates remain available through export. No character artwork is required by the simplified layout.

## Complete data access within the presentation

The user requested the three ranked logo cards across the top of the tools view, followed by the complete comparison table. The short three-view navigation remains. Closed-by-default full-response disclosures expose all twenty substantive CSV questions and every answer category with counts, bases and percentages. Timestamp remains source recency rather than an analytical measure.
