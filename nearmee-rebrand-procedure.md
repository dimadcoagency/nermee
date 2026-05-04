# Nearmee Rebrand Procedure
## From NerMee (green #00B14F) → Nearmee (coral #FF5757)

> Follow these steps IN ORDER. Each step builds on the previous one.
> Estimated time: 30-45 minutes.

---

## STEP 1: Update tailwind.config.js

Open `tailwind.config.js` and replace the entire colors section:

```js
colors: {
  nearmee: {
    coral:       '#FF5757',   // Primary brand — logo, accents, active states
    'coral-dark':'#E84E4E',   // CTA buttons — slightly deeper for contrast
    'coral-deep':'#9A2E2E',   // Text on light coral backgrounds
    light:       '#FFF0F0',   // Light accent fills, success backgrounds
    white:       '#FFFFFF',   // Page backgrounds, cards
    surface:     '#F7F7F7',   // Input fields, surface fills
    border:      '#EEEEEE',   // Borders, dividers
    text:        '#111111',   // Headlines, primary text
    'text-sec':  '#888888',   // Captions, labels, secondary text
    dark:        '#2D2D2D',   // Dark backgrounds, premium sections
  },
},
```

---

## STEP 2: Global find-and-replace in VS Code

Press `Ctrl + Shift + H` to open Find and Replace across all files.
Run these replacements ONE AT A TIME in this exact order:

### 2a. Replace brand name (case-sensitive)
```
Find:    NerMee
Replace: Nearmee

Find:    Nermee
Replace: Nearmee

Find:    nermee
Replace: nearmee
```
⚠️ Check each replacement — make sure folder names, URLs, and import paths update correctly.

### 2b. Replace primary color hex
```
Find:    #00B14F
Replace: #FF5757

Find:    #00b14f
Replace: #ff5757
```

### 2c. Replace dark green with dark neutral
```
Find:    #003D1A
Replace: #2D2D2D

Find:    #003d1a
Replace: #2d2d2d
```

### 2d. Replace light green with light coral
```
Find:    #E6F9EE
Replace: #FFF0F0

Find:    #e6f9ee
Replace: #fff0f0

Find:    #F0FFF4
Replace: #FFF0F0
```

### 2e. Replace Tailwind class names
```
Find:    nermee-green
Replace: nearmee-coral

Find:    bg-green-
Replace: bg-nearmee-coral

Find:    text-green-600
Replace: text-nearmee-coral

Find:    text-green-500
Replace: text-nearmee-coral

Find:    border-green
Replace: border-nearmee-coral
```
⚠️ Be careful with semantic green (success states). 
    booking "confirmed" status should stay green (#10B981), NOT change to coral.
    Only replace green that was used as the BRAND color.

### 2f. Replace focus ring color
```
Find:    focus:ring-green
Replace: focus:ring-nearmee-coral

Find:    focus:border-green
Replace: focus:border-nearmee-coral
```

---

## STEP 3: Update public/manifest.json

```json
{
  "name": "Nearmee",
  "short_name": "Nearmee",
  "description": "Services at your doorstep",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#FF5757",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

## STEP 4: Replace logo files

Export your new meerkat logo in these sizes and drop them into `public/icons/`:

| File | Size | Usage |
|------|------|-------|
| `icon-192.png` | 192x192 px | PWA manifest, Android home screen |
| `icon-512.png` | 512x512 px | PWA splash screen, Play Store |
| `favicon.ico` | 32x32 px | Browser tab icon |
| `logo-full.png` | 800px wide | Combined meerkat + "Nearmee" wordmark |
| `logo-mark.png` | 512x512 px | Meerkat in pin only (no text) |

If you have SVG versions, also save:
| `logo-full.svg` | any | Scalable combined logo |
| `logo-mark.svg` | any | Scalable icon mark |

---

## STEP 5: Update globals.css

Open `src/styles/globals.css` and make sure input focus states use coral:

```css
/* Replace any green focus styles with: */
input:focus,
textarea:focus,
select:focus {
  border-color: #FF5757 !important;
  box-shadow: 0 0 0 3px #FFF0F0;
  outline: none;
}
```

---

## STEP 6: Update src/lib/constants.js

Make sure the APP_NAME is updated:

```js
export const APP_NAME = 'Nearmee';
export const APP_TAGLINE = 'Services at your doorstep';
export const APP_DOMAIN = 'nearmee.app';
```

---

## STEP 7: Update CLAUDE.md

These sections need updating in CLAUDE.md:

### 7a. Project Identity section
```
**App Name:** Nearmee
**Domain:** nearmee.app
**Tagline:** "Services at your doorstep"
**Logo:** Meerkat mascot inside location pin, coral #FF5757
**Mascot:** Meerkat — alert, social, community-based
```

### 7b. Brand Tokens section — replace entire color block
```js
nearmee: {
  coral:       '#FF5757',
  'coral-dark':'#E84E4E',
  'coral-deep':'#9A2E2E',
  light:       '#FFF0F0',
  white:       '#FFFFFF',
  surface:     '#F7F7F7',
  border:      '#EEEEEE',
  text:        '#111111',
  'text-sec':  '#888888',
  dark:        '#2D2D2D',
}
```

### 7c. Design Rules — update rule #4
```
OLD: Green is the ONLY accent color.
NEW: Coral #FF5757 is the ONLY accent color. No blue, green, or purple brand accents.
     Use #E84E4E (coral-dark) for CTA buttons — deeper shade gives better 
     white text contrast and avoids the "error/danger" feel of pure red buttons.
     Reserve #10B981 green ONLY for success/confirmed status indicators.
```

---

## STEP 8: Update Vercel

### 8a. Add custom domain
Go to Vercel Dashboard → your project → Settings → Domains
- Add `nearmee.app`
- Follow DNS instructions from your domain registrar

### 8b. Update environment variables if needed
No changes needed — Supabase keys stay the same.

### 8c. Redeploy
```bash
git add .
git commit -m "rebrand: NerMee green → Nearmee coral with meerkat logo"
git push
```
Vercel auto-deploys on push.

---

## STEP 9: Verification checklist

After deploying, check these on your phone:

- [ ] Splash screen shows Nearmee logo (meerkat) in coral
- [ ] Browser tab shows meerkat favicon
- [ ] Address bar color is coral (#FF5757) on Android Chrome
- [ ] Home screen header says "Nearmee" not "NerMee"
- [ ] All CTA buttons are coral, not green
- [ ] Category pills turn coral when active, not green
- [ ] Price text is coral (#FF5757)
- [ ] PRO/BIZ tags are coral
- [ ] Input focus rings are coral/light-coral, not green
- [ ] Booking "confirmed" status is still GREEN (semantic, not brand)
- [ ] Booking "pending" status is still AMBER (semantic, not brand)
- [ ] No leftover green (#00B14F) anywhere in the UI
- [ ] PWA install prompt shows "Nearmee" as the app name
- [ ] manifest.json theme_color is #FF5757

---

## STEP 10: Update external assets

- [ ] GitHub repo description: update to "Nearmee — local services marketplace"
- [ ] Facebook page: update cover photo, profile picture, name
- [ ] Domain: purchase nearmee.app and connect to Vercel
- [ ] Supabase: rename project to "nearmee" in dashboard (optional, cosmetic)

---

## COLOR QUICK REFERENCE CARD

Keep this handy while coding:

| Token | Hex | Where to use |
|-------|-----|-------------|
| `nearmee-coral` | #FF5757 | Logo, active states, prices, links, accents |
| `nearmee-coral-dark` | #E84E4E | Primary CTA buttons (Book, Confirm, Publish) |
| `nearmee-coral-deep` | #9A2E2E | Text on light coral backgrounds |
| `nearmee-light` | #FFF0F0 | Light fills, selected states, notification bg |
| `nearmee-surface` | #F7F7F7 | Input fields, card surfaces, inactive bg |
| `nearmee-border` | #EEEEEE | All borders and dividers |
| `nearmee-text` | #111111 | Headlines, primary text |
| `nearmee-text-sec` | #888888 | Captions, labels, helper text |
| `nearmee-dark` | #2D2D2D | Dark mode bg, merchant earnings card |

| Semantic | Hex | ONLY for |
|----------|-----|----------|
| Success | #10B981 | Confirmed bookings, active status, verified badge |
| Warning | #F59E0B | Pending bookings, expiring boosts |
| Info | #3B82F6 | In-progress bookings, informational banners |
| Danger | #DC2626 | Cancelled bookings, errors, delete actions |

⚠️ NEVER use semantic colors as brand accent. 
   Brand = coral. Status = semantic colors above.

---

## WHAT NOT TO CHANGE

These should stay the same — no rebrand needed:
- Database schema (all tables, columns, RLS policies)
- Supabase project and API keys
- Component logic and business rules
- Folder structure
- Auth flow (phone OTP)
- Booking statuses and their semantic colors
- Category icons (emoji stay the same)
- Font family (Plus Jakarta Sans stays)
- Pricing (Pro P299, Business P899)

The rebrand is VISUAL ONLY. Zero business logic changes.
