# GreenGlobe - Environmental Protection Platform

An environmental protection platform focused on preserving Azerbaijan's natural heritage through community engagement, education, and action.

## Overview

GreenGlobe enables citizens to participate in environmental competitions, join eco-events, report environmental problems, and learn about Azerbaijan's diverse ecosystems including the Caspian Sea, Caucasus Mountains, and protected national parks.

## Features

### Environmental Competitions
- **8 Interactive Quizzes** covering topics like Wildlife Protection, Water Conservation, Sustainable Living, Renewable Energy, Azerbaijan Biodiversity, Caspian Sea Conservation, Climate Change, and Forest Conservation
- **55+ Multilingual Questions** available in Azerbaijani, English, and Russian
- Score tracking and leaderboards

### Eco-Events
- Browse and register for environmental events (cleanups, tree planting, wildlife conservation)
- Full RSVP system with register/unregister functionality
- Event categories and location information
- Past events archive

### Community Engagement
- **Community Posts** - Share discussions, event reviews, and wishes
- **Problem Reporting** - Report environmental issues to authorities
- Like and comment functionality
- User profiles with activity tracking

### Interactive Caspian Sea Section
- Animated flip cards with sea facts
- Environmental challenges and solutions
- Sustainable development information

### User Dashboard
- Personal competition scores
- Event registration history
- Achievement tracking

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI component library |
| TypeScript | Type-safe development |
| Vite | Build tool and dev server |
| Wouter | Client-side routing |
| TanStack Query | Server state management |
| Tailwind CSS | Utility-first styling |
| Shadcn/ui | Component library |
| Radix UI | Accessible UI primitives |
| Framer Motion | Animations |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web server framework |
| Passport.js | Authentication |
| OpenID Connect | Replit Auth integration |

### Database
| Technology | Purpose |
|------------|---------|
| PostgreSQL | Relational database (Neon) |
| Drizzle ORM | Type-safe queries |
| Zod | Schema validation |

## Internationalization

The platform supports three languages:
- **English (en)** - Default
- **Azerbaijani (az)** - Native language
- **Russian (ru)** - Regional language

Language can be switched via the globe icon in the navigation bar.

## Theming

- **Light Mode** - Clean white background with green accents
- **Dark Mode** - Dark greenish-black background with light text

Theme toggle available in the navigation bar.

## Project Structure

```
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities (i18n, theme, query client)
│   │   └── pages/          # Page components
├── server/                 # Backend application
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # Data access layer
│   └── auth.ts             # Authentication setup
├── shared/                 # Shared code
│   └── schema.ts           # Database schema & types
└── migrations/             # Database migrations
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `SESSION_SECRET` - Session encryption key

4. Push database schema:
   ```bash
   npm run db:push
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push schema to database |

## API Endpoints

### Authentication
- `GET /api/login` - Initiate login
- `GET /api/logout` - Logout user
- `GET /api/user` - Get current user

### Events
- `GET /api/events` - List all events
- `POST /api/events/:id/register` - Register for event
- `DELETE /api/events/:id/register` - Unregister from event

### Competitions
- `GET /api/competitions` - List competitions
- `GET /api/competitions/:id/questions` - Get quiz questions
- `POST /api/scores` - Submit quiz score

### Community
- `GET /api/community-posts` - List posts
- `POST /api/community-posts` - Create post
- `POST /api/community-posts/:id/like` - Like post
- `POST /api/community-posts/:id/comments` - Add comment

## Design Features

- **Vibrant Gradients** - Multi-color gradient designs throughout
- **Interactive Animations** - Hover effects, scale transitions, shimmer effects
- **Responsive Layout** - Mobile-first design with adaptive layouts
- **Accessible Components** - Built on Radix UI primitives

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT License

---

Built with love for Azerbaijan's environment 🌿
