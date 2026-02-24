# geoSync ♁

A biophysical relationship compatibility app that uses birth data and behavioral patterns to generate compatibility insights — moving beyond astrology to science-grounded relationship analysis.

![geoSync](https://img.shields.io/badge/React-18-blue) ![Node](https://img.shields.io/badge/Node.js-18+-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen) ![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌍 What is geoSync?

geoSync analyzes compatibility across three dimensions:

- **Chronotype Sync** — Daily rhythm alignment and energy patterns
- **Stress Response** — How you handle pressure and conflict
- **Seasonal Rhythm** — Vulnerability windows and energy cycles

## 🧬 The Science

Unlike astrology, geoSync is grounded in:

- **Environmental imprinting** — How birth season and latitude affect neurotransmitter development
- **Chronobiology** — Natural daily and seasonal energy patterns
- **Behavioral science** — Stress responses and social preferences

## ✨ Features

- **Responsive Design** — Fully mobile-friendly across all screen sizes
- **Dark Theme** — Elegant dark UI with warm copper/amber accents
- **Custom Accordion Selects** — Beautiful animated form controls
- **Compatibility Reports** — Detailed 3-dimension analysis with strategies
- **Seasonal Forecasting** — 90-day energy and risk predictions
- **Coaching Nudges** — Personalized relationship insights
- **Connection Management** — Add and track multiple relationships

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/leooladimu/geoSync.git
cd geoSync
```

2. **Install dependencies**

```bash
# Install root dependencies
npm install

# Install client and server dependencies
cd client && npm install && cd ..
cd server && npm install && cd ..
```

3. **Set up environment variables**

Create `server/.env`:

```bash
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/geosync
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
```

Create `client/.env`:

```bash
VITE_API_URL=http://localhost:5000/api
```

4. **Start the development servers**

In separate terminals:

```bash
# Terminal 1: Start backend
cd server && npm run dev

# Terminal 2: Start frontend
cd client && npm run dev
```

This will start:

- Backend server on http://localhost:5000
- Frontend on http://localhost:5173

## 📁 Project Structure

```
geoSync/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── auth/       # Auth shared components
│   │   │   ├── dashboard/  # Dashboard widgets
│   │   │   ├── onboarding/ # Onboarding steps
│   │   │   └── report/     # Compatibility report parts
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # API and utilities
│   │   └── theme/          # styled-components theme
│   └── public/
├── server/                 # Express.js backend
│   ├── controllers/        # API route handlers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route definitions
│   ├── services/           # Business logic
│   ├── middleware/         # Auth middleware
│   └── server.js           # Entry point
└── package.json
```

## 🎨 Tech Stack

### Frontend

- **React 18** with Hooks
- **Vite** for fast dev/build
- **styled-components** for CSS-in-JS
- **React Router** for navigation
- **Custom theme system** with breakpoints and design tokens

### Backend

- **Node.js + Express**
- **MongoDB + Mongoose**
- **JWT authentication**
- **bcrypt** for password hashing
- **Nominatim** for geocoding

## 🔧 API Endpoints

### Authentication

| Method | Endpoint             | Description    |
| ------ | -------------------- | -------------- |
| POST   | `/api/auth/register` | Create account |
| POST   | `/api/auth/login`    | Sign in        |

### Profiles

| Method | Endpoint              | Description                |
| ------ | --------------------- | -------------------------- |
| POST   | `/api/profile/create` | Create biophysical profile |
| GET    | `/api/profile/me`     | Get current user profile   |
| PUT    | `/api/profile/update` | Update profile             |

### Connections

| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| GET    | `/api/connections`     | List all connections |
| POST   | `/api/connections`     | Add a connection     |
| DELETE | `/api/connections/:id` | Remove connection    |

### Compatibility

| Method | Endpoint                                    | Description |
| ------ | ------------------------------------------- | ----------- |
| GET    | `/api/compatibility/:connectionId`          | Get report  |
| POST   | `/api/compatibility/generate/:connectionId` | Regenerate  |

### Forecasting

| Method | Endpoint                            | Description         |
| ------ | ----------------------------------- | ------------------- |
| GET    | `/api/forecast/:connectionId`       | Get 90-day forecast |
| GET    | `/api/forecast/:connectionId/range` | Get date range      |

### Nudges

| Method | Endpoint                  | Description       |
| ------ | ------------------------- | ----------------- |
| GET    | `/api/nudges`             | Get active nudges |
| PATCH  | `/api/nudges/:id/dismiss` | Dismiss nudge     |

## � Deployment

### Frontend (Vercel)

1. Connect your GitHub repo to Vercel
2. Set build command: `cd client && npm run build`
3. Set output directory: `client/dist`
4. Add environment variable: `VITE_API_URL=https://your-api.onrender.com/api`

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repo
3. Set root directory: `server`
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT=10000`

See [README_ENV.md](./README_ENV.md) for detailed environment variable templates.

## 🔒 Security

- JWT-based authentication with secure tokens
- Password hashing with bcrypt (10 salt rounds)
- Protected API routes via auth middleware
- Environment variables for secrets

## � Pages & Components

### Pages

| Page                 | Route         | Description             |
| -------------------- | ------------- | ----------------------- |
| Welcome              | `/welcome`    | Landing page            |
| Login                | `/login`      | User sign in            |
| Register             | `/register`   | Account creation        |
| Onboarding           | `/onboarding` | 3-step profile setup    |
| Dashboard            | `/dashboard`  | Main app interface      |
| Compatibility Report | `/report/:id` | Detailed analysis       |
| The Science          | `/science`    | Methodology explanation |

### Key Components

- `ProfileSummary` — User biophysical profile display
- `ConnectionsList` — Manage relationships
- `ForecastStrip` — Seasonal predictions timeline
- `NudgesFeed` — Coaching insights feed
- `ScoreRing` — Visual compatibility scores
- `CustomSelect` — Animated accordion dropdown

## 📱 Responsive Breakpoints

| Breakpoint | Size   | Target        |
| ---------- | ------ | ------------- |
| `sm`       | 480px  | Mobile        |
| `md`       | 768px  | Tablet        |
| `lg`       | 1024px | Desktop       |
| `xl`       | 1280px | Large screens |

## 🧪 Development

### Running locally

```bash
# Start both servers (from root)
cd server && npm run dev &
cd client && npm run dev
```

### Linting

```bash
cd client && npm run lint
```

### Building for production

```bash
cd client && npm run build
```

## 📈 Future Roadmap

- [ ] User-to-user connections (invite system)
- [ ] Push notifications for nudges
- [ ] Mobile app (React Native)
- [ ] Advanced seasonal analytics dashboard
- [ ] Relationship coaching chat integration
- [ ] Export reports as PDF

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

Built with modern web technologies and grounded in chronobiology research.

---

**geoSync** ♁ — _Science-grounded relationship compatibility_
