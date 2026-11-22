# Get You Collab (GYC) — Indian Influencer Marketing CRM

**Get You Collab** is an enterprise-grade Influencer Marketing CRM and Creator Intelligence Web Application designed specifically for Indian creator-marketing agencies and brand partners. Built with Next.js (App Router), TypeScript, Tailwind CSS, Recharts, and Supabase (PostgreSQL with Row Level Security).

---

## 🌟 Key Features

### 🌓 Dark Mode & Light Mode (New!)
- **Universal Theme Toggle**: Toggle between Light Mode (crisp slate & clean white cards) and Dark Mode (sleek dark slate `#090d16` and midnight `#0F172A` cards) from the top header or the creator profile page.
- **Instant System / LocalStorage Persistence**: Theme preference is saved locally across sessions via `localStorage` with zero-flash inline hydration.
- **Contrast & Accessibility**: Recharts charts, form inputs, status badges, and modal dialogs are fully calibrated for high contrast and readability in both modes.

### 1. Dual-Portal Architecture with Strict Data Isolation
- **Portal 1: Creator Dashboard (`/creator`)**
  - **Header Badge**: `"INFLUENCER PORTAL"` + quick demo role switcher & logout.
  - **Overview**: Personalized `"Welcome back, Aarav 👋"`, privacy protected workspace banner, 4 KPI cards:
    - *My brand deals*: `3`
    - *My content pieces*: `8`
    - *My tracked views*: `48,200`
    - *My attributed sales*: `₹1,86,400`
  - **Campaign Performance Table**: Tracking badge, clicks (`510`), orders (`32`), sales (`₹76,800`), commission (`₹7,680`) for `"Luma Beauty · Glow Into Summer"`.
  - **My Brand Deals (`/creator/deals`)**: Status flow (`Invited → Accepted → Content Submitted → Approved → Live → Completed`), deliverable checklists, Accept/Decline actions, and upload content modal for Reels & Drive links.
  - **Sales & Attribution Performance (`/creator/sales`)**: Interactive Recharts for daily clicks, orders, and GMV growth; conversion rate gauge, campaign filters, and a **Live Order Simulator** (`Simulate ₹2,400 Sale`) to test real-time webhooks.
  - **My Earnings & Payouts (`/creator/earnings`)**: Earned, pending escrow, and net paid cards; **Section 194J TDS (10%)** tax deduction banner; UPI ID & Bank account manager; disbursement register with UTR reference numbers; printable **Tax Invoice & Payment Receipt PDF modal**.
  - **Reports (`/creator/reports`)**: CSV download & printable ledger for campaign performance and TDS statements.
  - **Profile & Settings (`/creator/profile`)**: Social links (@aarav.lifestyle), verified audience split (Gender, Age brackets, Top Tier-1/2 Indian cities), PAN card, and UPI ID.

- **Portal 2: Creator Intelligence & Leaderboard (`/admin/insights`)**
  - **Creator Leaderboard**: Sortable by Attributed GMV, Engagement Rate, Avg Views, and Reliability Score.
  - **Insight Cards**: Top Earner, Highest Engagement, Best Conversion, Low Reliability alerts, and Creators Without Active Deals.
  - **Side-by-Side Creator Comparison**: Compare 2–3 creators side-by-side across followers, views, engagement %, GMV, on-time delivery %, reliability index, and audience gender/age split.
  - **Per-Creator Deep Dive Drawer**: In-depth inspection of audience demographics, top Reels, and verified PAN/banking details.
  - **Multi-Factor Filters**: Niche (Beauty, Tech, Fitness, Fashion, Lifestyle, Food, Gaming), Platform (Instagram, YouTube, Mixed), City (Mumbai, Delhi NCR, Bengaluru, Pune, etc.), and Follower Tier (Nano, Micro, Macro, Mega).
  - **Fraud Detection & Traffic Anomaly Flags**: Automated flag for suspicious click spikes with near-zero conversion rate (e.g., Tanya Sen: 3,420 clicks with 0.05% CR flagged for bot review).

- **Admin CRM Modules**
  - **Agency Dashboard (`/admin`)**: Agency GMV, active campaigns, pending content approvals, and task reminders.
  - **Creators Pipeline Kanban (`/admin/creators`)**: 5 pipeline stages (`Lead → Contacted → Negotiating → Onboarded → Active`) with stage advancement and Add Creator modal.
  - **Brand Directory (`/admin/brands`)**: Directory of 5+ Indian brand partners (Luma Beauty, BoAt Lifestyle, Mamaearth, Cult.fit, Snitch).
  - **Campaigns (`/admin/campaigns`)**: 8+ campaigns with budgets, delivery dates, objectives, and commission rates.
  - **Deals & Contracts (`/admin/deals`)**: Comprehensive agreement management and status updates.
  - **Content Approvals (`/admin/approvals`)**: Review submitted draft assets, approve, or request revisions with feedback notes.
  - **Tracking & Attribution (`/admin/tracking`)**: Deep link UTM builder (`utm_source`, `utm_medium`, `utm_campaign`, `coupon`), and live click/order simulators.
  - **Payouts & TDS (`/admin/payouts`)**: Automated 10% TDS deduction under Section 194J, UTR number recording, and payment advice generation.
  - **Tasks & Follow-ups (`/admin/tasks`)**: Priority task board (Urgent, High, Medium, Low) for agency team.
  - **Activity Timeline (`/admin/activity`)**: Real-time audit trail of all agency events.
  - **Reports & Export (`/admin/reports`)**: Multi-format CSV export and printable sheets.

---

## 🇮🇳 Indian Localization Highlights
- **Currency**: Indian Rupee (`₹`) with standard Indian numbering (`₹1,86,400`, `₹7,680`).
- **Income Tax Compliance**: Section 194J TDS (10% rate for technical/influencer services) auto-deducted from payouts, with PAN card tracking and Form 16A quarterly certificates.
- **Payment Rails**: Direct support for UPI ID (`username@oksbi`), NEFT, IMPS, IFSC codes, and Bank UTR settlement numbers.
- **Dates**: Indian formatted dates (e.g. `Oct 18, 2026`).

---

## 🔑 Demo Accounts & 1-Click Role Switcher

You can test either role using the standard login page at `/login` or the **1-Click Demo Switcher** in the top navigation bar:

| Role | Email | Password | Landing Page | Description |
|---|---|---|---|---|
| **Creator** | `aarav@creator.in` | `creator123` | `/creator` | Aarav Mehta (Macro Lifestyle Creator, 3 Deals, ₹1.86L GMV) |
| **Agency Admin** | `admin@getyoucollab.com` | `admin123` | `/admin` | Full Agency CRM, Creator Insights, Approvals & Payouts |

---

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Dark Navy (`#0F172A`) palette & rounded card aesthetics
- **Charts**: Recharts (Responsive Area, Bar, and Line charts)
- **Icons**: Lucide React
- **Database / Auth**: Supabase (PostgreSQL with Row Level Security)
- **Local Fallback**: Built-in reactive store pre-seeded with 11 creators, 5 brands, 8 campaigns, deals, tracking links, and payouts so the app runs offline without configuration!

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+ (tested on Node v22.17)
- npm or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables (Optional)
If connecting to a live Supabase project, create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
*(If omitted, Get You Collab automatically runs on the rich local seed dataset).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

### 4. Production Build & Start
```bash
npm run build
npm start
```

---

## 🗄️ Database Setup (Supabase PostgreSQL + RLS)

The complete SQL schema with Row Level Security is provided in `supabase/schema.sql`.

### Tables Created:
1. `profiles` (extends `auth.users`, role-based access)
2. `creators` (handles, demographics, PAN, UPI, reliability index)
3. `brands` (brand directories, contact details, total spend)
4. `campaigns` (budgets, dates, commission rates)
5. `deals` (deliverables, deadlines, statuses, attributed sales)
6. `content_items` (draft assets, live links, approval notes)
7. `tracking_links` (short slugs, UTM parameters, coupon codes)
8. `clicks` (click logs with IP hash, device, city)
9. `orders` (e-commerce sales attributed to creators)
10. `commissions` (earnings calculation per deal)
11. `payouts` (10% TDS deduction, UTR numbers, invoice IDs)
12. `tasks` (agency follow-ups & reminders)
13. `activities` (audit log of agency events)

### Deploying Schema to Supabase:
1. Go to your **Supabase Dashboard** -> **SQL Editor**.
2. Copy and paste the entire contents of `supabase/schema.sql`.
3. Click **Run**.
4. All 13 tables and their strict RLS policies will be created. Creators can only read and update records tied to their own `creator_id`, while Admins have full access.

---

## ☁️ Deployment Guide (Vercel)

1. Push this repository to GitHub or GitLab.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Set the Framework Preset to **Next.js**.
5. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click **Deploy**.
7. Vercel will automatically compile, optimize, and serve your Get You Collab CRM globally!
