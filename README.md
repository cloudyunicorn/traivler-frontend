# 🖥️ Traivler Frontend — Next.js 16 Web Dashboard

The frontend of **Traivler** is a modern, responsive web application designed with a dark, premium aesthetic. It allows users to configure a detailed travel profile, track the multi-agent AI execution pipeline in real-time, and view their generated plans in a clean dashboard.

---

## 🎨 Design Aesthetics & Visuals

The UI is built to feel premium and responsive:
- **Aesthetic**: A rich dark mode with a dark indigo background (`#030014`), custom neon accents, border highlights, and transparent glassmorphic cards (`backdrop-blur-md`).
- **Typography**: Optimized clean layout, featuring a customized sans-serif font family.
- **Animations**: Subtle, hardware-accelerated animations powered by **Framer Motion** for state transitions, wizard-step changes, and live status progress pulses.
- **Interactivity**: Dynamic hover micro-animations, color gradients, and glowing buttons to enhance user engagement.

---

## 🧭 Page Features Walkthrough

### 1. Landing Page (`/`) — [app/page.tsx](app/page.tsx)
- Serves as the entrance to the planner.
- Includes descriptive feature cards highlighting AI planning, live flight routing, neighborhood analysis, and transparent cost breakdowns.
- Prominently displays the call-to-action button to initiate planning.

### 2. 5-Step Planning Wizard (`/plan`) — [app/plan/page.tsx](app/plan/page.tsx)
The wizard splits the complex traveler profile configuration into five digestible steps:
*   **Step 1: Where & When**: Includes the custom [AirportAutocomplete](components/forms/AirportAutocomplete.tsx) component (which polls the backend fuzzy autocomplete cache) and the [DateRangePicker](components/forms/DateRangePicker.tsx).
*   **Step 2: Travelers**: Inputs traveler counts, age groups, companion types (Solo, Couple, Family, Friends), and triggers child-friendly policies.
*   **Step 3: Trip Style**: Collects primary intent (Relaxation, Exploration, Adventure, Cultural, Romantic, Party), pace (Relaxed, Moderate, Packed), and traveler fitness levels (Low, Moderate, High).
*   **Step 4: Preferences**: Sets budget boundaries (Budget-Friendly, Moderate, Premium, Luxury), lodging tier (Budget, Mid-Range, Luxury), activity interests, food preferences (Vegan, Vegetarian, Halal, Seafood, Street Food), and strict avoids (such as crowds, heights, or spicy food).
*   **Step 5: Final Touches**: Declares special occasions (Anniversary, Birthday, Honeymoon) and logs custom text notes for the planner agent.

### 3. Real-Time Pipeline Tracker
*   When a user clicks "Plan My Trip", the wizard step components transition out to render the custom [LoadingPipeline](components/ui/LoadingPipeline.tsx) status tracker.
*   By opening a **Server-Sent Events (SSE)** connection via the `/stream-plan` endpoint, the frontend streams events indicating which agent is currently executing.
*   Nodes such as **Planner**, **Search**, **Flight**, **Hotel**, **Itinerary**, and **Cost Verification** turn from a loading state to completed checks in real-time as updates are received, giving users visibility into the multi-agent execution status.

### 4. Results Dashboard (`/results`) — [app/results/page.tsx](app/results/page.tsx)
Once the pipeline finishes execution, the resulting structured JSON is parsed and displayed in a dashboard consisting of dedicated modular components:
*   [SummaryCard](components/results/SummaryCard.tsx): Summarizes the plan context, including dates, travelers, and custom trip themes.
*   [FlightCard](components/results/FlightCard.tsx): Displays airport connections, real price-per-person data, round-trip/open-jaw details, flight duration, and booking shortcuts.
*   [HotelCard](components/results/HotelCard.tsx): Suggests optimal neighborhood zones to reside in and provides corrected average prices per night.
*   [ItineraryTimeline](components/results/ItineraryTimeline.tsx): Outlines a vertical timeline detailing the curated activities mapped out day-by-day.
*   [CostBreakdown](components/results/CostBreakdown.tsx): Breaks down estimated budgets across flights, hotels, dining, local transport, and sightseeing in the selected currency, presenting an verified total sum.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) for CSS design tokens and class names.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for fluid motion transitions and keyframe animations.
- **State Management & Fetching**: [TanStack React Query v5](https://tanstack.com/query/latest) for server state handling.
- **UI Components**: Primitives built using Radix UI and customized via Tailwind.
- **Icons**: React Icons (Hi2) for standard outlines.

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- npm, yarn, pnpm, or bun

### 1. Installation
Install project dependencies from the frontend directory:

```bash
cd traivler-frontend
npm install
```

### 2. Configuration
Create a `.env.local` file in the frontend folder to set the backend URL:

```env
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

### 3. Running Locally
Launch the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the application.

---

## 📁 Directory Structure Overview

- `app/` — Next.js routing pages.
  - `page.tsx` — Landing page.
  - `plan/` — Step-by-step form wizard and SSE event receiver.
  - `results/` — Dashboard to display the final itinerary response.
- `components/` — Reusable react components.
  - `forms/` — Form control components (Date picker, Airport autocomplete).
  - `results/` — Layout cards for displaying specific trip categories.
  - `ui/` — Base design components (Buttons, inputs, loaders).
- `hooks/` — Custom hooks (Debouncing, plan mutations).
- `lib/` — API fetch handlers and Tailwind utilities.
- `types/` — Type definitions mirroring the backend schemas.
