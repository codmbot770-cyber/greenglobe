# EcoFriendsAz - Environmental Protection Platform

## Overview

EcoFriendsAz is an environmental protection platform focused on preserving Azerbaijan's natural heritage through community engagement. The platform enables users to participate in environmental competitions (quizzes), join eco-events (cleanups, tree planting, wildlife conservation), and report environmental problems. The application aims to educate citizens about ecological issues while facilitating real-world environmental action across Azerbaijan's diverse ecosystems including the Caspian Sea, Caucasus Mountains, and protected national parks.

## Internationalization (i18n)

The platform supports three languages:
- **English (en)** - Default language
- **Azerbaijani (az)** - Native language support
- **Russian (ru)** - Regional language support

**Implementation:**
- I18nProvider context in `client/src/lib/i18n.tsx` manages language state
- Language preference stored in localStorage with key "language"
- useTranslation hook provides `t()` function for translations and `setLanguage()` for switching
- Language switcher in Navbar with globe icon and flag emojis
- Translations cover all UI text: navigation, buttons, page content, forms, labels

## Dark Theme Support

The platform supports light and dark themes:
- **Light mode** - Default theme with white background and green accents
- **Dark mode** - Dark greenish-black background with light text

**Implementation:**
- ThemeProvider context in `client/src/lib/theme.tsx` manages theme state
- Theme preference stored in localStorage with key "theme"
- useTheme hook provides `theme` (current theme) and `toggleTheme()` for switching
- Theme toggle button in Navbar (Moon icon for light mode, Sun icon for dark mode)
- CSS variables in `client/src/index.css` define colors for `:root` (light) and `.dark` (dark)
- Tailwind CSS with `darkMode: ["class"]` configuration
- Theme automatically respects system preference on first visit

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type-safe UI development
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management and data fetching
- Shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design tokens

**Design System:**
- Custom color palette focused on Azerbaijan's environmental theme: green (primary), white (background), blue (secondary)
- Typography: Inter for body text, Montserrat for headings via Google Fonts CDN
- Spacing system using Tailwind's 4/6/8/12/16/20/24 unit scale
- Responsive grid layouts: 3-column desktop, 2-column tablet, single-column mobile
- Component library includes 30+ pre-built UI components (buttons, cards, dialogs, forms, etc.)

**Key Pages:**
- Landing page (unauthenticated users) with hero section, statistics, and feature highlights
- Home dashboard (authenticated users) showing personalized activity and recommendations
- About page with mission statement, team profiles, and organizational values
- Competitions page displaying 8 active quizzes (Wildlife Protection, Water Conservation, Sustainable Living, Renewable Energy, Azerbaijan Biodiversity, Caspian Sea Conservation, Climate Change & Azerbaijan, Forest Conservation) with 55+ questions
- Events page with 12 events featuring unique stock photos per event (coastal cleanup, forest reforestation, wildlife sanctuary, eco workshop, river cleanup, urban garden, and more)
- Community page for user discussions, event reviews, and event wishes with like/comment functionality (post types: general, review, wish)
- Blogs page for user feedback and ideas about environmental initiatives (post types: feedback, idea) - separate from Community
- Problems page featuring Caspian Sea environmental challenges with three tabs: Issues (oil spills, water levels, invasive species, pollution), Sustainable Solutions (green technology, renewable energy, conservation, eco-tourism), and Community Reports
- Dashboard page showing user's competition scores, event registrations, and achievements

**State Management:**
- TanStack Query handles all server state with automatic caching and refetching
- Authentication state managed through custom `useAuth` hook
- Query invalidation on mutations for real-time data updates
- Optimistic updates disabled by default (staleTime: Infinity)

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for REST API
- HTTP server creation for potential WebSocket support
- Custom logging middleware tracking request duration and JSON responses
- Static file serving for production builds

**Authentication:**
- Replit Auth integration using OpenID Connect (OIDC)
- Passport.js strategy for session-based authentication
- PostgreSQL session storage via connect-pg-simple
- Session TTL of 7 days with secure, httpOnly cookies
- User profile data includes email, firstName, lastName, profileImageUrl, isAdmin flag

**API Design:**
- RESTful endpoints under `/api` namespace
- Authentication-protected routes using `isAuthenticated` middleware
- Standard CRUD operations for events, competitions, scores, and registrations
- Error handling returns appropriate HTTP status codes with descriptive messages

**Data Access Layer:**
- Storage abstraction interface (`IStorage`) defining all data operations
- Separation of concerns: routes handle HTTP, storage handles database operations
- Type-safe database queries using Drizzle ORM schema types
- Support for complex queries (filtering past events, active competitions, user-specific data)

### Database Schema

**ORM & Migrations:**
- Drizzle ORM for type-safe database operations
- PostgreSQL dialect with Neon serverless database support
- WebSocket connection pooling for serverless environments
- Schema defined in shared directory for client/server code reuse
- Migration files stored in `/migrations` directory

**Core Tables:**

1. **sessions** - Session storage for authentication
   - sid (primary key), sess (jsonb), expire (timestamp with index)

2. **users** - User profiles
   - id (UUID primary key), email (unique), firstName, lastName, profileImageUrl
   - isAdmin (boolean), createdAt, updatedAt timestamps

3. **events** - Ecological events
   - id (auto-increment), title, description, location, imageUrl
   - eventDate, category, isPast (boolean), maxParticipants
   - createdAt, updatedAt timestamps

4. **competitions** - Environmental quizzes
   - id (auto-increment), title, description, difficulty
   - totalQuestions, timeLimit, maxScore, isActive (boolean)
   - createdAt, updatedAt timestamps

5. **competition_questions** - Multilingual quiz questions
   - id (auto-increment), competitionId (foreign key)
   - questionAz (Azerbaijani text, required), optionsAz (array, required)
   - questionEn (English text, optional), optionsEn (array, optional)
   - questionRu (Russian text, optional), optionsRu (array, optional)
   - correctAnswer, points, createdAt timestamp
   - Helper functions in Quiz.tsx select language-appropriate content with fallback to Azerbaijani

6. **user_scores** - Competition results
   - id (auto-increment), userId (foreign key), competitionId (foreign key)
   - score, completedAt timestamp

7. **event_registrations** - Event participation
   - id (auto-increment), userId (foreign key), eventId (foreign key)
   - registeredAt timestamp

8. **community_posts** - User-generated blog content
   - id (auto-increment), userId (foreign key), content (text)
   - postType (discussion/review/event_wish), status (draft/published/archived)
   - likesCount, commentsCount, createdAt, updatedAt timestamps

9. **post_likes** - Like tracking for community posts
   - id (auto-increment), postId (foreign key), userId (foreign key)
   - createdAt timestamp

10. **post_comments** - Comments on community posts
    - id (auto-increment), postId (foreign key), userId (foreign key)
    - content (text), createdAt timestamp

**Validation:**
- Zod schemas generated from Drizzle tables using drizzle-zod
- Insert/update schemas enforce data integrity at application layer
- Type inference ensures client and server use consistent data structures

### Build System

**Development:**
- Vite dev server with HMR (Hot Module Replacement)
- Middleware mode integration with Express backend
- Custom error overlay plugin for runtime errors
- Dynamic index.html reloading with cache-busting

**Production:**
- esbuild for server bundling with tree-shaking
- Vite for optimized client build with code splitting
- Server dependencies bundled (allowlist) to reduce cold start times
- Output: `dist/index.cjs` (server), `dist/public/` (client assets)

**Type Checking:**
- Strict TypeScript configuration across client/server/shared code
- Path aliases: `@/` (client), `@shared/` (shared), `@assets/` (assets)
- Incremental compilation with build info caching

## External Dependencies

### Infrastructure Services

**Neon Database:**
- Serverless PostgreSQL database with WebSocket connections
- Connection string via `DATABASE_URL` environment variable
- Automatic connection pooling through `@neondatabase/serverless`

**Replit Platform:**
- OIDC authentication provider at `https://replit.com/oidc`
- Session secret via `SESSION_SECRET` environment variable
- Development tooling: cartographer plugin, dev banner, error modal
- `REPL_ID` environment variable for deployment identification

### UI Component Libraries

**Radix UI:**
- 20+ headless component primitives (accordion, dialog, dropdown, select, tabs, etc.)
- Full keyboard navigation and ARIA compliance
- Unstyled components allowing custom design implementation

**Shadcn/ui:**
- Pre-styled components built on Radix primitives
- Tailwind CSS integration with CSS variables for theming
- Copy-paste component architecture (components owned by project)

### Utility Libraries

**Data Fetching:**
- TanStack Query v5 for async state management
- Automatic request deduplication and background refetching
- Built-in loading/error states

**Styling:**
- Tailwind CSS v3 with PostCSS and Autoprefixer
- clsx and tailwind-merge for conditional class composition
- class-variance-authority for variant-based component APIs

**Forms:**
- React Hook Form for performant form state management
- Hookform resolvers for Zod schema validation integration

**Date Handling:**
- date-fns for date formatting and manipulation (no moment.js bloat)

**Development Tools:**
- tsx for TypeScript execution in development
- Drizzle Kit for database migrations and schema management

### Planned Integrations (Not Yet Implemented)

The Problems page UI suggests future integrations for:
- Map services for location-based environmental issue reporting
- Image upload/storage for photo documentation
- Government API integration for forwarding reports to environmental authorities