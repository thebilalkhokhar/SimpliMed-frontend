# Simplimed — Frontend MVP

AI-powered medical report analysis and personal health intelligence platform.

---

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v3 |
| Icons | Raw inline SVGs — no external library |
| UI Components | Custom only — no Shadcn / external component libraries |
| Fonts | Geist Sans + Geist Mono (via `next/font/google`) |
| React | React 19 |

---

## Getting Started

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm start         # serve production build
```

---

## Project Structure

```
Simplimed_frontend/
├── app/
│   ├── globals.css              # Medical Light Theme — CSS tokens + component classes
│   ├── layout.tsx               # Root layout — fonts, metadata, viewport
│   ├── (public)/                # Public marketing pages
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Landing page (hero, how it works, capabilities, testimonials, FAQ + CTA)
│   │   └── pricing/
│   │       └── page.tsx         # Pricing page (plans, FAQ + CTA side-by-side)
│   ├── (auth)/                  # Authentication pages
│   │   ├── layout.tsx
│   │   ├── signin/
│   │   │   └── page.tsx         # Sign in — animated gradient background + glowing card
│   │   ├── signup/
│   │   │   └── page.tsx         # Sign up — same visual style as sign in
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── plans/
│   │       └── page.tsx
│   ├── (workspace)/             # Chat / AI workspace
│   │   ├── layout.tsx
│   │   └── chat/
│   │       └── page.tsx         # Main chat page — input, report analysis, AI chat panel
│   └── (dashboard)/             # Authenticated dashboard pages
│       ├── layout.tsx           # Shell: Sidebar + Navbar + scrollable content
│       └── dashboard/
│           ├── page.tsx
│           ├── analysis/
│           ├── profile/
│           ├── reports/
│           └── settings/
│
├── components/
│   ├── chat/                    # Chat workspace components
│   │   ├── CenterStage.tsx      # Report analysis display (findings, charts, actions, gauges)
│   │   ├── ChatInputZone.tsx    # File upload + text input area
│   │   ├── ChatSidebar.tsx      # Left sidebar — history, search, user menu
│   │   ├── RightChatPanel.tsx   # AI chat panel with message bubbles
│   │   ├── PlansModal.tsx       # Plans management modal
│   │   └── SettingsModal.tsx    # Settings modal
│   ├── shared/                  # Layout infrastructure
│   │   ├── Navbar.tsx           # Top navigation bar
│   │   ├── Sidebar.tsx          # Dashboard sidebar
│   │   ├── PublicHeader.tsx     # Public pages header
│   │   └── PublicFooter.tsx     # Public pages footer
│   └── ui/                      # Primitive components
│       ├── AuthCard.tsx
│       ├── AuthSplitLayout.tsx
│       ├── Badge.tsx            # Medical status badge
│       ├── Button.tsx           # primary | secondary | ghost variants
│       ├── Card.tsx             # Elevated surface card
│       └── Input.tsx            # Accessible labeled input
│
├── hooks/
│   ├── useLocalStorage.ts
│   └── useMediaQuery.ts
│
├── types/
│   └── index.ts                 # UserProfile, Report, Metric, Analysis, Insight
│
├── public/                      # Static assets (SVG illustrations)
├── tailwind.config.ts
├── next.config.ts
├── postcss.config.js
├── tsconfig.json
├── .gitignore
└── package.json
```

---

## Key Features

### Landing Page (`/`)
- Animated gradient mesh hero with floating glass cards
- 3-step "How it works" section with diagonal ribbon backgrounds
- Auto-scrolling capabilities marquee
- Testimonials carousel with horizontal slide animation
- FAQ + CTA side-by-side layout with glowing gradient border card

### Authentication (`/signin`, `/signup`)
- Animated blob background with diagonal ribbon
- Rotating conic-gradient glowing border card
- Full form validation with inline error messages
- Google OAuth button (mock)
- Email verification modal (signup)

### Pricing (`/pricing`)
- Annual/monthly toggle with 33% savings badge
- 4-tier plan cards with highlighted "Most Popular"
- FAQ + CTA merged side-by-side section
- Trust badges strip

### Chat Workspace (`/chat`)
- Collapsible left sidebar with chat history, search, and user menu
- Welcome state with suggestion chips and file upload
- Report analysis center stage (CenterStage) with:
  - Health report header with "Chat with AI" + "Download Report" buttons
  - Alert banner (prediabetes detection)
  - Key findings grid with color-coded status cards
  - Blood sugar trend SVG chart
  - HbA1c half-circle gauge
  - Recommended actions checklist with progress ring
  - Questions to ask your doctor
  - AI confidence breakdown
  - Lifestyle tips
- Resizable right chat panel (desktop drag handle)
- Right panel hidden by default — opens via "Chat with AI" button
- Mobile responsive: bottom tab bar switches between Analysis and Chat views
- Report doesn't refresh on follow-up messages (separate loading states)

---

## Design System — Medical Light Theme

All tokens are CSS custom properties in `app/globals.css`, mirrored into Tailwind via `tailwind.config.ts`.

### Color Tokens

| Token | Hex | Usage |
| --- | --- | --- |
| `--color-bg-base` | `#FFFFFF` | Cards, inputs, modal surfaces |
| `--color-bg-subtle` | `#F8FAFC` | Page background |
| `--color-text-primary` | `#0F172A` | Headings |
| `--color-text-secondary` | `#475569` | Body copy |
| `--color-brand` | `#4F46E5` | Buttons, focus rings, nav indicators |
| `--color-normal-text` | `#059669` | Normal metric status |
| `--color-abnormal-text` | `#E11D48` | Elevated / abnormal metric status |
| `--color-info-text` | `#2563EB` | Informational / reduced metric status |

### Component Classes

```css
.card            /* white card, subtle shadow */
.card-md         /* white card, medium shadow */
.btn-primary     /* indigo filled button */
.btn-secondary   /* white outlined button */
.btn-ghost       /* transparent text button */
.input           /* styled form input */
.badge-normal    /* green status badge */
.badge-abnormal  /* rose status badge */
.badge-info      /* blue status badge */
.section-label   /* uppercase tracking label */
```

### Animations

```css
@keyframes gradient-rotate    /* Rotating conic gradient border (auth cards, CTA cards) */
@keyframes blob-1/2/3         /* Floating background blobs */
@keyframes shimmer            /* Button shimmer effect */
@keyframes marquee            /* Auto-scrolling capabilities carousel */
@keyframes float/float-slow   /* Floating glass cards in hero */
```

---

## Icons

All icons are raw inline SVGs embedded directly in components. No Lucide, Heroicons, or any other icon library is used.

---

## Environment Variables

Create `.env.local` at the project root (this file is git-ignored):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Contributing

- Branch format: `feature/your-feature-name` or `fix/issue-description`
- No inline `style` props for design tokens — use CSS custom properties or Tailwind utilities
- No external icon libraries — inline SVG only
- Run `npm run build` before opening a PR to catch type and build errors
