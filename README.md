# 🏁 Shreya's Pit Wall — F1 2026 Dashboard

A pixel-perfect, fully dynamic F1 dashboard built with **Next.js 14 (App Router)** + **Tailwind CSS**, powered by real F1 APIs.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
# → http://localhost:3000

# 3. Production build
npm run build && npm start
```

---

## 🧱 Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | Next.js 14 (App Router)             |
| Styling     | Tailwind CSS + Global CSS (hybrid)  |
| Runtime     | React 18 (Server + Client mix)      |
| Data        | Jolpica F1 API + OpenF1 API         |
| Fonts       | Playfair Display · Inter · JetBrains Mono |

---

## 📁 Project Structure

```
pitwall/
├── app/
│   ├── layout.jsx              ← Root layout + metadata
│   └── page.jsx                ← Server Component: parallel API fetch
│
├── components/
│   ├── Ticker.jsx              ← [Client] Live scrolling ticker bar
│   ├── Hero.jsx                ← [Client] Dynamic greeting + live date
│   ├── RaceHero.jsx            ← [Client] Next race card + live countdown
│   ├── Calendar.jsx            ← [Client] Season calendar + auto-scroll
│   ├── DriversStandings.jsx    ← [Server] WDC top-10 standings
│   ├── ConstructorsStandings.jsx ← [Server] WCC all-teams standings
│   ├── PaddockNews.jsx         ← [Server] Last race podium + news
│   ├── StatsRibbon.jsx         ← [Server] Key season stats bar
│   └── Footer.jsx              ← [Server] Footer
│
├── lib/
│   └── api.js                  ← API utilities, team colors, fallbacks
│
├── styles/
│   └── globals.css             ← Keyframes, animations, pseudo-elements
│
├── tailwind.config.js          ← All CSS vars mapped to Tailwind theme
└── next.config.js
```

---

## 🔌 APIs Used

### Jolpica F1 (Ergast Mirror)
Base: `https://api.jolpi.ca/ergast/f1`

| Endpoint                           | Used For                    |
|------------------------------------|-----------------------------|
| `/2026.json`                       | Season calendar             |
| `/2026/driverStandings.json`       | Drivers' Championship       |
| `/2026/constructorStandings.json`  | Constructors' Championship  |
| `/current/next.json`               | Next race details           |
| `/2026/{round}/results.json`       | Last race podium            |

### OpenF1
Base: `https://api.openf1.org/v1`

| Endpoint                   | Used For                    |
|----------------------------|-----------------------------|
| `/laps?session_key=latest` | Fastest lap data            |
| `/pit?session_key=latest`  | Fastest pit stop data       |

---

## 🎨 Styling Architecture

### Hybrid Approach

**Tailwind CSS** handles:
- Layout primitives (`flex`, `grid`, spacing)
- Color tokens (via `tailwind.config.js` theme extension)
- Basic typography utilities

**`styles/globals.css`** handles:
- All 12 keyframe animations (`maskRevealUp`, `ticker`, `barGrowSlow`, etc.)
- Pseudo-elements (`::before`, `::after`) for team color bars, news hover effects
- Complex gradient backgrounds (checker flag, race block texture)
- `clip-path` animations
- Hover transitions that require multiple property changes

### CSS Variables → Tailwind Colors

All original CSS custom properties are mapped in `tailwind.config.js`:

```js
colors: {
  carbon:       '#0a0a0a',
  'carbon-3':   '#1d1d1d',
  paper:        '#f2ece0',
  racing:       '#e10600',
  gold:         '#d4a017',
  mercedes:     '#27F4D2',
  ferrari:      '#E8002D',
  // ... all 11 teams
}
```

---

## ⚙️ Server vs Client Component Split

| Component               | Type   | Why                                      |
|-------------------------|--------|------------------------------------------|
| `page.jsx`              | Server | Parallel data fetch with `Promise.all`   |
| `DriversStandings`      | Server | Pure render from props, no interactivity |
| `ConstructorsStandings` | Server | Pure render from props                   |
| `PaddockNews`           | Server | Pure render from props                   |
| `StatsRibbon`           | Server | Pure render from props                   |
| `Footer`                | Server | Static content                           |
| `Hero`                  | Client | `useEffect` for greeting/live date       |
| `RaceHero`              | Client | `setInterval` countdown timer            |
| `Calendar`              | Client | `useRef` + `scrollTo` for auto-scroll    |
| `Ticker`                | Client | CSS animation, dynamic content           |

---

## 🔄 Data Revalidation

All server-side fetches use Next.js Incremental Static Regeneration:

```js
fetch(url, { next: { revalidate: 60 } })  // 60 seconds
```

Calendar data revalidates every hour (less likely to change):
```js
fetch(url, { next: { revalidate: 3600 } })
```

---

## 🛡️ Error Handling & Fallbacks

Every API function is wrapped in `try/catch` with typed fallbacks. If any API is down, the UI renders with static 2026 data — **the page never crashes**.

```
API call fails
    └─→ returns [] or null
         └─→ page.jsx checks: arr.length ? liveData : FALLBACK_DATA
              └─→ component renders normally with fallback
```

Fallback data is in `lib/api.js`:
- `FALLBACK_DRIVERS` — Top 10 drivers with 2026 standings
- `FALLBACK_CONSTRUCTORS` — All 11 constructors
- `FALLBACK_NEXT_RACE` — Miami GP details
- `STATIC_NEWS` — 4 paddock news stories

---

## ✏️ Customization

### Change whose dashboard this is
In `Hero.jsx`: update the name in the `setGreeting` call.
In `page.jsx`: update ticker `'ROOKIE'` entry.
In `Footer.jsx`: update the "For Shreya" text.

### Add a news API
In `lib/api.js`, add a `getNews()` function using the NewsAPI:
```js
export async function getNews() {
  const res = await fetch(
    'https://newsapi.org/v2/everything?q=Formula+1&sortBy=publishedAt&apiKey=YOUR_KEY',
    { next: { revalidate: 300 } }
  );
  const data = await res.json();
  return data.articles?.slice(0, 4).map(a => ({
    kicker: 'Breaking',
    headline: a.title,
    body: a.description,
    lead: false,
    neutral: true,
  })) ?? STATIC_NEWS;
}
```
Then pass the result into `<PaddockNews news={news} />`.

### Change the featured race
In `RaceHero.jsx`, the race data comes directly from the API's `nextRace` prop. No manual edits needed — it auto-updates.

---

## 🏎️ Team Colors

All 11 constructors are mapped in `lib/api.js`:

```js
export const TEAM_COLORS = {
  mercedes:      '#27F4D2',
  ferrari:       '#E8002D',
  mclaren:       '#FF8000',
  'red bull':    '#3671C6',
  williams:      '#64C4FF',
  haas:          '#B6BABD',
  alpine:        '#0093CC',
  audi:          '#00877C',
  'racing bulls':'#6692FF',
  'aston martin':'#229971',
  cadillac:      '#8A9099',
};
```

The `getTeamColor(teamName)` utility does fuzzy matching — so `"Mercedes-AMG Petronas"` correctly resolves to `#27F4D2`.

---

## 📐 Animations Preserved

| Animation         | Trigger          | Duration    |
|-------------------|------------------|-------------|
| `maskRevealUp`    | Title lines      | 1.1s each   |
| `underlineDraw`   | Title underline  | 1.2s        |
| `checkerFadeIn`   | Brand eyebrow    | 0.9s        |
| `fadeUpSlow`      | Sections         | 1.0s each   |
| `ticker`          | Top bar          | 48s loop    |
| `speedLineSlow`   | Hero background  | 5.5s loop   |
| `barGrowSlow`     | Constructor bars | 1.4s each   |
| `rowSlide`        | Table rows       | Staggered   |
| `pulseDot`        | Live indicators  | 1.8s loop   |
| `blink`           | Live badge dot   | 1.6s loop   |
| `flagWave`        | Race flags       | 2.8–3s loop |

---

*Lights out and away we go. 🏁*
