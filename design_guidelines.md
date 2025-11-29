# Design Guidelines: Azerbaijan Ecological Protection Platform

## Design Approach

**Selected Approach:** Reference-Based with Environmental Focus
Drawing inspiration from educational platforms (Khan Academy's clarity), environmental organizations (WWF's impact-driven design), and event platforms (Eventbrite's card-based layouts). The design emphasizes trust, accessibility, and engagement for Azerbaijan's ecological mission.

**Color Acknowledgment:** User has specified green, white, and blue palette reflecting Azerbaijan's environmental focus. Detailed color implementation will follow these guidelines.

## Typography System

**Font Selection:**
- **Primary:** Inter (via Google Fonts CDN) - clean, modern, highly readable
- **Accent:** Montserrat (via Google Fonts CDN) - bold headers and CTAs

**Hierarchy:**
- Hero Headlines: text-5xl to text-6xl, font-bold
- Section Headers: text-3xl to text-4xl, font-semibold
- Subsections: text-xl to text-2xl, font-medium
- Body Text: text-base to text-lg, font-normal
- Captions/Meta: text-sm, font-normal

## Layout & Spacing System

**Spacing Primitives:** Tailwind units of 4, 6, 8, 12, 16, 20, 24
- Component padding: p-6, p-8
- Section spacing: py-16, py-20, py-24
- Card gaps: gap-6, gap-8
- Container max-width: max-w-7xl

**Grid System:**
- Desktop: 3-column grids for events/competitions cards
- Tablet: 2-column layouts
- Mobile: Single column, full-width stacking

## Page-Specific Layouts

### Home Page
- **Hero Section:** Full-width with Azerbaijan nature imagery (Caspian Sea, mountains), centered headline "Protecting Azerbaijan's Natural Heritage", subheadline, dual CTAs (Register for Competitions, View Events). Height: min-h-[600px]
- **Impact Statistics:** 4-column grid showcasing key metrics (events hosted, participants, protected areas, competitions completed)
- **Featured Sections:** 2-column layout highlighting Competitions and Events with preview cards
- **Call-to-Action Banner:** Full-width encouraging user registration

### About Us
- **Mission Section:** Centered text block with max-w-4xl
- **Team Grid:** 3-column card layout with team member photos, roles, descriptions
- **Values Section:** 3-column icon + text cards explaining environmental commitments

### Competitions Page
- **Hero Banner:** Competition overview with quiz icon visual
- **Quiz Preview Cards:** Grid of available competitions, each card showing:
  - Competition title
  - Difficulty level badge
  - Question count
  - Estimated time
  - Prize indicator
  - "Start Quiz" CTA button
- **Leaderboard Section:** Table layout showing top participants, scores, achievements

### Events Page
- **Filter Bar:** Horizontal layout with date filters, category tags, search input
- **Events Grid:** 3-column card layout, each event card includes:
  - Event image (Azerbaijan locations)
  - Date badge overlay
  - Event title and description
  - Location with map pin icon
  - Registration status
  - "Learn More" button
- **Past Events:** Separate collapsible section with similar grid

### Problems Section (Placeholder)
- **Coming Soon Hero:** Centered messaging with illustration
- **Preview Text:** What to expect when feature launches
- **Newsletter signup:** Stay updated CTA

## Component Library

**Navigation Bar:**
- Sticky header with logo left, navigation links center, user profile/login right
- Mobile: Hamburger menu transitioning to full-screen overlay

**Cards:**
- Rounded corners (rounded-lg to rounded-xl)
- Subtle shadows (shadow-md, hover:shadow-lg)
- Padding: p-6
- Border treatment for definition

**Buttons:**
- Primary: Solid fill, font-semibold, px-6 py-3, rounded-lg
- Secondary: Border outline style
- When on images: backdrop-blur-md bg-white/90 for readability

**Forms:**
- Input fields: Consistent height (h-12), rounded-md, border, focus states
- Labels: text-sm font-medium, mb-2
- Validation: Inline error messaging

**Quiz Interface:**
- Question card with progress indicator
- Multiple choice options as selectable cards
- Score display with circular progress visual
- Results summary with achievement badges

**Event Cards:**
- Image aspect ratio: 16:9
- Overlay gradient for text readability
- Date badge positioned top-right
- Hover lift effect (translate-y)

## Icons & Assets

**Icon Library:** Heroicons via CDN
- Navigation: outline variants
- CTAs: solid variants for emphasis
- UI feedback: mini variants

**Images Required:**
- Hero: Azerbaijan landscape (Caspian coastline or Caucasus mountains) - 1920x1080
- About: Team photos, Azerbaijan nature reserves
- Events: Various ecological event photos from Azerbaijan
- Competitions: Educational/quiz illustrations
- Placeholder: "Coming soon" graphic for Problems section

## Authentication & User Experience

**Login/Register:**
- Modal overlay with form
- Social login options (Replit Auth integration)
- Clear error states and success feedback

**User Dashboard:**
- Profile card with avatar, stats
- Competition history with scores
- Registered events list
- Achievement badges display

## Accessibility & Responsiveness

- Minimum touch target: 44x44px
- Focus indicators on all interactive elements
- Skip navigation link
- ARIA labels for icon buttons
- Semantic HTML throughout
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

## Animations (Minimal)

- Page transitions: Fade in (300ms)
- Card hover: Lift effect (transform, 200ms)
- Modal appearance: Scale + fade
- No scroll-triggered animations to maintain performance and accessibility

This design creates a professional, trustworthy platform that effectively communicates Azerbaijan's environmental mission while providing engaging interactions for competitions and events.