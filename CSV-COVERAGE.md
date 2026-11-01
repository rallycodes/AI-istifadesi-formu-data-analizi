# CSV coverage in the three-view presentation

All 20 substantive survey questions are accessible. The timestamp is used as source recency in methodology, not as a usage trend. Source records are unchanged. The default flow stays concise; each view's **Bütün cavablar** disclosure contains every category with its count, denominator and percentage.

| View | Questions available in full responses |
| --- | --- |
| Ümumi mənzərə | AI-use status, age, gender, occupation, field: 5 questions |
| Alətlər və məqsədlər | Tool choices, purposes, frequency, experience, paid-plan use: 5 questions |
| Etibar və seçimlər | Trust, hiding AI use, presenting AI work as own work, personal sharing, a day without AI, perception of AI users, willingness to pay, doctor choice, teacher choice, AI as tool/friend: 10 questions |

The tools presentation uses three ranked logo cards at the top, then the complete eight-row comparison directly underneath. ChatGPT, Gemini and Claude lead in the supplied sample; rankings and displayed counts recalculate with filters. All eight tool/category results remain in the comparison rather than being truncated to the top three. The four leading purposes stay in the concise main summary; all purpose categories are in the disclosure.

Active-user questions use the selected AI-user base. General questions use all selected respondents. Multi-select tool and purpose choices are deduplicated per respondent; their percentages may sum above 100%. Each full-response question identifies eligible base, answered count and missing count. All questions remain represented after filtering, with an explicit no-response message when empty.

Verification: the browser suite checks the exact set of 20 question keys against the API, every rendered category count/base and every percentage rounded to one decimal. It checks loaded local logos, three ranked cards above the eight-row comparison, closed disclosures by default and expanded tables at mobile size in both themes. Total: 22 browser checks pass, zero browser page errors. TypeScript and production build pass. Captures and results: `.impeccable/review/presentation/`.
