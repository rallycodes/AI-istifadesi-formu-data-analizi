# Character artwork for AI Studio

Create four images. They are decoration, never data or respondent portraits. The app is complete without them and never shows empty image frames. Use one consistent original character family inspired by the rounded, expressive 3D portraits in the supplied reference. Do not copy an identifiable character.

## Shared art direction

Stylized premium 3D editorial characters, adult proportions with gently enlarged heads, warm expressive faces, understated clothing, rounded acetate glasses where specified, soft clay-like skin and fabric, subtle subsurface scattering, clean studio rendering. Use lavender, warm ochre, plum and charcoal clothes. Soft neutral key light from upper left and a restrained lavender rim light. Detailed but not photographic. No text, logos, medals, UI, sparkles, emoji, confetti, scenery or baked-in colored backgrounds. Transparent alpha; clean edges; no white halo; no ground shadow. Keep hands and hair inside the frame. Characters must remain readable at 80–160 pixels. Same camera, lighting and materials for the whole set. These characters do not imply the survey respondents look like them.

Export transparent PNG at 1536 × 1536. When integrating, convert to transparent WebP, ideally under 200 KB per image. Keep the editable PNG masters outside public/. Each file below is a separate image, not a sprite sheet. Include a little empty space above the hair, with the body cropped naturally at the waist. Compose the face in the upper half; keep facial features visible against both very dark navy and very pale lavender.

| File to deliver | Placement | Character and pose | Priority |
| --- | --- | --- | --- |
| research-guide.png | Bottom sidebar research note; at most 95px wide | Adult researcher, short dark curly hair, lavender overshirt, round glasses. Waist-up, welcoming expression, looking gently left toward the page content, holding a closed charcoal notebook low at waist. Right side of composition. | Required |
| tool-researcher.png | First tool podium, warm gold tint, right side | Mature researcher with salt-and-pepper hair, trimmed beard, ochre cardigan, softly rounded dark glasses. Confident, thoughtful smile, three-quarter view looking left, hands low. | Required |
| tool-explorer.png | Second tool podium, lavender tint, right side | Young adult with side-swept dark hair, warm medium skin, lavender jacket, round glasses, curious smile. Waist-up, three-quarter view looking left, holding a small closed notebook. | Required |
| tool-creator.png | Third tool podium, plum tint, right side | Adult woman with auburn bob, round glasses, muted plum top. Warm focused expression, waist-up, slight three-quarter turn toward left, one hand resting on a closed sketchbook at waist. | Required |

## Prompts to paste

Paste the shared art direction above into each generation, then append the matching paragraph:

**research-guide:** Single adult research guide with short dark curly hair and round charcoal acetate glasses, wearing a lavender overshirt over an ivory tee. Welcoming thoughtful expression. Waist-up three-quarter portrait, gaze gently left. A closed charcoal notebook held low at waist. Character toward the right of a square transparent canvas, face unobstructed, clean silhouette. Do not draw any graph or interface.

**tool-researcher:** Single mature researcher with salt-and-pepper hair and a neatly trimmed beard, softly rounded dark glasses, warm ochre cardigan over charcoal. Confident thoughtful smile. Waist-up three-quarter portrait, turned slightly left, relaxed hands kept low. Square transparent canvas. No trophy, ranking number, medal or tool branding.

**tool-explorer:** Single young adult researcher with side-swept dark hair, warm medium skin and round glasses. Lavender jacket over a quiet charcoal tee. Curious optimistic smile. Waist-up three-quarter portrait looking left, holding a small closed notebook low. Square transparent canvas. No trophy, ranking number, medal or tool branding.

**tool-creator:** Single adult woman researcher with an auburn bob and round glasses, muted plum top, warm focused expression. Waist-up three-quarter portrait looking gently left, one hand resting on a closed sketchbook at waist. Square transparent canvas. No trophy, ranking number, medal or tool branding.

## Integration

After approval, place converted files in public/characters/ as research-guide.webp, tool-researcher.webp, tool-explorer.webp and tool-creator.webp. Rebuild the app; it detects only files that exist. The same transparent assets serve both themes. Do not generate separate background panels, artificial graphs, tool logos or fake respondent avatars.

The podium artwork is decorative; ranking, names, percentages and source logos remain live HTML. Final crop and contrast must be reviewed when the actual artwork arrives. If a delivered image has a background, remove it before integration rather than hiding it with a circular mask.
