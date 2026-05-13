# Marketplace Hub — Product Requirements Document

A dynamic marketplace platform that blends Reddit's community-driven content with eBay's marketplace functionality, featuring real-time announcements and live activity feeds.

**Experience Qualities**:

1. **Dynamic** — The interface feels alive with scrolling announcements, real-time updates, and constant activity that creates urgency and excitement
2. **Discoverable** — Content is organized like Reddit with voting and discussions, but items are actionable like eBay with bidding and purchasing
3. **Connected** — Live activity sidebar creates FOMO and social proof, showing what others are doing in real-time

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)

This is a marketplace with social features, requiring feeds, real-time updates, user authentication, item listings, activity streams, and modal-based interactions.

---

## Essential Features

### 1. News Ticker / Announcement Scroll

**Functionality**: Auto-scrolling horizontal banner showing flash prizes, promotions, trending items, and platform announcements  
**Purpose**: Creates urgency, highlights special offers, and keeps users informed of time-sensitive opportunities  
**Trigger**: Loads automatically on page load, continuously scrolls  
**Progression**: Page loads → Ticker appears below header → Announcements scroll left infinitely → User can click announcement for details  
**Success Criteria**: Smooth scrolling animation, readable text, clickable announcements, seamless loop

### 2. Main Feed (Reddit/eBay Hybrid)

**Functionality**: Card-based feed showing marketplace listings with upvote/downvote, comments, prices, and bid counts  
**Purpose**: Central content discovery combining social voting with commerce  
**Trigger**: User lands on homepage  
**Progression**: Feed loads → User scrolls → Click listing to expand → Vote/comment/bid → Sort by hot/new/price  
**Success Criteria**: Smooth scrolling, accurate vote counts, responsive cards, clear pricing

### 3. Live Activity Sidebar (20% width)

**Functionality**: Right-side column showing real-time updates: new job posts, recent bids, user signups, completed sales  
**Purpose**: Creates social proof and FOMO, shows platform is active and trustworthy  
**Trigger**: Updates stream in real-time as actions occur  
**Progression**: Activity appears → Scrolls with timestamps → New items push to top → Old items fade out  
**Success Criteria**: Updates appear instantly, timestamps are relative, smooth animations, doesn't interrupt main content

### 4. Floating Auth Dialog

**Functionality**: Bottom-right floating button opens modal with Sign In / Sign Up / Guest options, supporting OAuth providers (GitHub, Google, Microsoft, LinkedIn) and email/password authentication  
**Purpose**: Persistent, non-intrusive access to authentication from anywhere  
**Trigger**: User clicks floating profile/auth button or top-right dropdown  
**Progression**: Click button → Dialog slides in → Choose OAuth provider or email → Complete flow → Dialog closes → User logged in  
**Success Criteria**: Button visible but not obtrusive, dialog smooth animation, clear options, OAuth integrations functional, closes on success

### 5. Marketplace Listings

**Functionality**: Items displayed with images, titles, prices, current bids, vote counts, and seller info  
**Purpose**: Core marketplace content showing what's available  
**Trigger**: User browses feed, searches, or filters  
**Progression**: View listing card → Click for details → See full description → Place bid or buy → Confirm purchase  
**Success Criteria**: Clear pricing, accurate bid counts, seller ratings visible, responsive images

### 6. Voting & Engagement

**Functionality**: Reddit-style upvote/downvote system affects listing visibility and ranking  
**Purpose**: Community curation of quality listings  
**Trigger**: User clicks up/down arrow on listing  
**Progression**: Click vote → Count updates → Listing rank adjusts → Visual feedback  
**Success Criteria**: Vote persists, counts accurate, can change vote, affects sorting

---

## Edge Case Handling

**No Listings Available**: Show empty state with "Be the first to post" CTA  
**Slow Activity Feed**: If no recent activity, show historical highlights from past hour  
**No Auth Required for Browsing**: Guest users can browse and vote, auth required for posting/bidding  
**Long Announcements**: Ticker handles variable length messages smoothly  
**Sidebar Overflow**: Activity feed limits to 50 most recent, auto-scrolls for more  
**Mobile Responsive**: Sidebar moves to bottom drawer on mobile, ticker remains at top

---

## Design Direction

The design should evoke a **bustling marketplace meets community forum**—vibrant, energetic, and addictive. Think neon signs in a night market combined with the familiarity of Reddit. Colors are bold and eye-catching. The news ticker pulses with urgency. The activity sidebar creates a sense of constant motion. Every element screams "things are happening here."

---

## Color Selection

**Primary Color**: Deep Purple `oklch(0.45 0.18 285)` — Bold, premium, marketplace sophistication  
**Secondary Colors**:

- Bright Cyan `oklch(0.75 0.15 195)` for accents and highlights — Fresh, modern, digital
- Warm Amber `oklch(0.78 0.14 70)` for prices and CTAs — Urgency and value  
  **Accent Color**: Hot Pink `oklch(0.65 0.22 350)` — High energy for announcements, flash sales, special offers  
  **Success**: `oklch(0.68 0.17 145)` for positive actions  
  **Upvote**: `oklch(0.70 0.18 35)` orange for upvotes  
  **Downvote**: `oklch(0.58 0.15 260)` blue for downvotes

**Foreground/Background Pairings**:

- Background `oklch(0.98 0.005 285)`: Dark Purple text `oklch(0.25 0.1 285)` — Ratio 10.5:1 ✓
- Primary Purple `oklch(0.45 0.18 285)`: White text `oklch(1 0 0)` — Ratio 7.8:1 ✓
- Accent Pink `oklch(0.65 0.22 350)`: White text `oklch(1 0 0)` — Ratio 5.2:1 ✓
- Amber CTA `oklch(0.78 0.14 70)`: Dark text `oklch(0.25 0.05 70)` — Ratio 8.1:1 ✓

---

## Font Selection

Typography should be **bold, modern, and highly readable** for rapid content scanning.

**Primary Font**: **Inter** — Versatile, highly readable, professional  
**Accent Font**: **Bebas Neue** — Bold, condensed, perfect for prices and headlines  
**Mono Font**: **JetBrains Mono** — For bids, prices, and technical data

**Typographic Hierarchy**:

- **H1 (Page Title)**: Bebas Neue / 48px / tight tracking / uppercase
- **H2 (Section Headers)**: Inter Bold / 28px / -0.01em tracking / 1.2 line height
- **H3 (Listing Titles)**: Inter Semibold / 20px / normal tracking / 1.3 line height
- **Price (Large)**: Bebas Neue / 32px / normal tracking / 1.1 line height
- **Body**: Inter Regular / 15px / normal tracking / 1.6 line height
- **Metadata**: Inter Medium / 13px / normal tracking / 1.4 line height

---

## Animations

Animations should **create energy and urgency** while maintaining smooth performance.

- **Ticker Scroll**: Smooth infinite scroll with 30-second loop, pauses on hover
- **Activity Feed**: New items slide in from top with bounce, fade out after 10 items
- **Vote Buttons**: Scale pulse on click (1.0 → 1.3 → 1.0) with color fill
- **Card Hover**: Lift 4px with shadow expansion, 150ms ease-out
- **Auth Dialog**: Slide up from bottom-right with backdrop blur fade-in
- **Price Updates**: Number counter animation for bids, color flash on change
- **Flash Announcements**: Subtle glow pulse on urgent/special announcements

---

## Component Selection

**Components**:

- **Card** (shadcn): Listing containers with hover effects and colored borders
- **Button** (shadcn): CTAs, bids, votes — customize with bold gradients
- **Badge** (shadcn): Category tags, status indicators, "NEW" labels
- **Avatar** (shadcn): User profiles in listings and activity feed
- **Dialog** (shadcn): Auth modal, listing details, bid confirmations
- **ScrollArea** (shadcn): Activity sidebar, long descriptions
- **Separator** (shadcn): Between feed items and sections
- **Input** (shadcn): Search, bid amounts, auth forms

**Customizations**:

- **NewsTicker**: Custom component with infinite scroll animation
- **ActivityFeed**: Custom real-time update stream with timestamp formatting
- **VoteButtons**: Custom up/down arrows with count and color states
- **PriceDisplay**: Custom component with currency formatting and size variants
- **FloatingAuthButton**: Custom fixed-position button with dialog trigger

**States**:

- **Vote Buttons**: Default → Hover (color hint) → Active (filled color) → Disabled (gray)
- **Listing Cards**: Default → Hover (lift + shadow) → Clicked (scale down) → Active Bid (glowing border)
- **Auth Button**: Default → Hover (expand label) → Open (icon rotates)

**Icon Selection**:

- `CaretUp` / `CaretDown` for voting
- `ShoppingCart` for purchases
- `Gavel` for auctions/bids
- `Fire` for hot/trending
- `Clock` for recently posted
- `User` / `UserCircle` for auth
- `Bell` for notifications
- `Tag` for categories
- `TrendUp` for activity

**Spacing**:

- Main container: `max-w-[1800px] mx-auto px-8`
- Feed cards: `gap-4` between cards, `p-6` internal
- Sidebar: `w-[20%] min-w-[280px]` with `p-4`
- Ticker: `h-12` with `px-6 py-3`

**Mobile**:

- Sidebar moves to bottom sheet/drawer
- Feed becomes full-width
- Ticker remains at top, smaller text
- Auth button stays bottom-right
- Cards stack vertically with full width
