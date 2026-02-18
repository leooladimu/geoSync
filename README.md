# ♁ geoSync

**Your relationships, read through the lens of when and where you began.**

geoSync is a full-stack MERN relationship coaching application that generates biophysical compatibility profiles from date and place of birth. It is grounded in chronobiology, environmental epigenetics, and geomagnetic research — not astrology.

---

## The Idea

Most personality frameworks ask who you think you are. geoSync asks something different: what were the environmental conditions present when your nervous system was first being wired?

The light cycles at your birth calibrate your brain's master clock. Your birth latitude shapes your prenatal Vitamin D levels and cortisol baseline. The season you arrived in influences your dopamine receptor density and stress response for life. These are not metaphors — they are documented mechanisms in chronobiology and environmental neuroscience.

geoSync uses this data to generate a **Biophysical Profile** for each user, then compares two profiles to produce a **Compatibility Report** across three dimensions: chronotype sync, stress response pairing, and seasonal vulnerability alignment. The result isn't a verdict — it's a user manual.

---

## Features

- **Biophysical Profile Generation** — derived from DOB, birth location (geocoded via Nominatim), and a 4-question calibration survey
- **Compatibility Scoring** — three-dimension analysis with weighted overall score, archetypes, friction point identification, and circuit-breaker strategies
- **Seasonal Forecasting** — rolling 90-day energy and mismatch risk forecast for each connection
- **Coaching Nudges** — contradiction detection engine that surfaces behavioral pattern alerts based on current month, profile, and connection context
- **Manual Connection Entry** — add connections without requiring them to create an account
- **Progressive Science Disclosure** — inline "why this?" callouts on data collection screens for curious users, invisible to everyone else

---

## Tech Stack

| Layer     | Technology                             |
| --------- | -------------------------------------- |
| Frontend  | React, React Router, Styled Components |
| Backend   | Node.js, Express                       |
| Database  | MongoDB, Mongoose                      |
| Auth      | JWT, bcryptjs                          |
| Geocoding | Nominatim (OpenStreetMap)              |
| State     | useState / props                       |

---

## Project Structure

```
/geosync
  /client
    /src
      /components
        /auth          — Shared auth primitives
        /dashboard     — ProfileSummary, ConnectionsList, ForecastStrip,
                         NudgesFeed, AddConnectionModal
        /onboarding    — StepBirthData, StepSurvey, StepReview, Shared
        /report        — ScoreRing, DimensionPanel, StrategyBlock
      /hooks           — useAuth
      /pages           — Welcome, Register, Login, Onboarding,
                         Dashboard, CompatibilityReport
      /theme           — index.js (theme + symbols), GlobalStyles.js
      /utils           — api.js
  /server
    /controllers       — auth, profile, connection, compatibility,
                         forecast, nudge
    /middleware        — auth.middleware.js
    /models            — User, BioProfile, Connection, CompatibilityReport,
                         SeasonalForecast, CoachingNudge
    /routes            — auth, profile, connection, compatibility,
                         forecast, nudge
    /services          — bioProfile, compatibility, forecast,
                         geocode, nudge
    server.js
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repo
git clone https://github.com/yourname/geosync.git
cd geosync

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### Environment Variables

Create `/server/.env`:

```env
MONGO_URI=mongodb://localhost:27017/geosync
JWT_SECRET=your_secret_here
PORT=5000
```

Create `/client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Running Locally

```bash
# Terminal 1 — start the API
cd server && npm run dev

# Terminal 2 — start the client
cd client && npm run dev
```

The client runs on `http://localhost:5173` by default.

---

## API Reference

### Auth

```
POST   /api/auth/register
POST   /api/auth/login
```

### Profile

```
GET    /api/profile
POST   /api/profile
PUT    /api/profile
```

### Connections

```
GET    /api/connections
GET    /api/connections/:id
POST   /api/connections
DELETE /api/connections/:id
```

### Compatibility

```
GET    /api/compatibility/:connectionId
POST   /api/compatibility/regenerate/:connectionId
```

### Forecast

```
GET    /api/forecast/:connectionId
GET    /api/forecast/:connectionId/range?from=YYYY-MM&to=YYYY-MM
```

### Nudges

```
GET    /api/nudges
PATCH  /api/nudges/:id/dismiss
```

---

## Core Services

### `bioProfile.service.js`

Takes raw DOB, latitude/longitude, and survey answers and derives the full biophysical profile. All derivation logic is pure functions with no database calls — fully testable in isolation.

Derives: `season`, `lightProfile`, `latitudeTier`, `chronotype`, `stressBaseline`, `vulnerabilityWindow`, `neurotransmitters`

Handles southern hemisphere season inversion.

### `compatibility.service.js`

Takes two derived profiles and scores them across three dimensions:

| Dimension       | Weight | What it measures               |
| --------------- | ------ | ------------------------------ |
| Chronotype Sync | 30%    | Daily energy peak alignment    |
| Stress Response | 40%    | Conflict pattern compatibility |
| Seasonal Rhythm | 30%    | Vulnerability window overlap   |

Stress response is weighted highest because it governs behavior during conflict — the moments when people have the least capacity to compensate for incompatibility.

### `forecast.service.js`

Computes energy levels (`peak`, `rising`, `dipping`, `low`) for each profile across any month range, derives mismatch risk, and generates specific recommendations and pre-written communication scripts.

### `nudge.service.js`

Detects five behavioral pattern categories:

| Category            | Trigger                                                     |
| ------------------- | ----------------------------------------------------------- |
| `withdrawal`        | Freeze profile entering vulnerability window                |
| `intensity-seeking` | Low dopamine baseline during vulnerability window           |
| `over-commitment`   | High-light profile in peak summer months                    |
| `scarcity-lock`     | High-latitude freeze profile (loyalty vs. obligation check) |
| `optimism-bias`     | High-light lark profile in spring surge                     |

Nudges are deduplicated — one active nudge per category per connection at a time.

---

## The Symbol System

geoSync uses archaic Unicode glyphs throughout the UI as semantic markers, not decoration:

| Glyph | Unicode | Meaning                                         |
| ----- | ------- | ----------------------------------------------- |
| ♁     | U+2641  | Earth — the app's core symbol                   |
| ⊕     | U+2295  | Earth (alt) — used on review/completion screens |
| ☉     | U+2609  | Sun — high-light profile, chronotype            |
| ☽     | U+263D  | Crescent moon — low-light profile               |
| ♈    | U+2648  | Spring equinox                                  |
| ♋    | U+264B  | Summer solstice                                 |
| ♎    | U+264E  | Autumn equinox                                  |
| ♑    | U+2651  | Winter solstice                                 |
| ✦     | U+2726  | Divider / decorative                            |

The solstice and equinox glyphs serve as season identifiers throughout the app — ♑ next to a winter-born profile, ♈ next to a spring-born one. They are technically zodiacal in origin but predate pop astrology and mark real astronomical moments.

---

## Geocoding

Birth location is geocoded at profile creation via the [Nominatim OpenStreetMap API](https://nominatim.openstreetmap.org/). Coordinates are stored permanently in MongoDB.

**Nominatim requirements:**

- Maximum 1 request per second
- A valid `User-Agent` header with contact information is required — update `geocode.service.js` before deploying
- No licensing restrictions on stored coordinate data

For production traffic, migrate to [Mapbox](https://www.mapbox.com/) (100,000 free requests/month, permissive licensing) rather than Google Maps (restrictive terms around permanent coordinate storage).

---

## Design Notes

**Dark geological palette** — `#0e0f0f` background, amber accent (`#c97d3a`), warm white text. Designed to feel grounded and distinct from the pastel aesthetic common to wellness and astrology apps.

**Typography** — Georgia serif for display/headings (weight and archaic quality), Inter sans-serif for UI and body copy. The contrast between them reinforces the app's dual identity: ancient pattern recognition, modern scientific framing.

**Progressive disclosure** — science callouts on data collection screens are collapsed by default behind a small "why this?" toggle. Users who want the research get it immediately; users who don't never see it.

---

## Caveats and Ethics

geoSync describes tendencies, not destinies. The biophysical profiles are derived from documented correlations in peer-reviewed research, but correlation is not determinism. A low compatibility score is a map, not a verdict. The app's coaching language is written to reinforce this consistently.

The app does not use traditional astrological sources, interpretations, or prediction frameworks. The zodiac glyphs used in the UI refer to their original astronomical meanings (solstices and equinoxes) rather than their astrological ones.

---

## License

MIT
