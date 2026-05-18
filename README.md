# Trashware

Trashware is a real-time smart bin monitoring dashboard for campus or facility operations. It helps staff monitor trash bin fill levels, track full bins, manage device records, review activity history, and handle alerts from one web app.

## Overview

This project is built with:

- Next.js (Pages Router)
- React
- TypeScript
- Tailwind CSS
- Firebase Firestore
- NextAuth

The application reads bin data from Firestore in real time and turns it into several operational views:

- `Dashboard`: summary cards and bins that need attention
- `Monitoring`: full live list of bins with search and status filters
- `Manage Bin`: create, edit, and delete bin records
- `Notifications`: alerts derived from full bins
- `History / Analytics`: trends and activity summaries from historical bin data
- `Authentication`: email/password and Google sign-in

## Main Features

- Real-time bin monitoring using Firestore `onSnapshot`
- Fill-level classification such as empty, nearly full, full, and offline
- Search by building, floor, room, and bin ID
- Full-bin notifications with read/unread state
- Bin CRUD management for operators
- Hourly history synchronization for analytics
- Credentials login and Google login with role stored in Firestore

## Tech Stack

- Framework: Next.js `16`
- UI: React `19`, Tailwind CSS `4`
- Auth: `next-auth`
- Database: Firebase Firestore
- Utilities: `date-fns`, `bcryptjs`, `react-icons`

## Project Structure

```text
src/
  components/
    dashboard/
    history/
    layout/
    manage/
    notifications/
  context/
    SearchContext.tsx
  lib/
    firebase.ts
    services/
      deriveNotificationService.ts
      historyAnalyticsService.ts
      historyService.ts
      notificationReadService.ts
  pages/
    api/
      auth/[...nextauth].ts
      register.ts
    auth/
      login/
      register/
    analytics/
    history/
    manage/
    monitoring/
    notifications/
    index.tsx
  styles/
  types/
  views/
```

## Application Flow

### 1. Authentication

- Users can register through `POST /api/register`
- Credentials login checks the `users` collection and compares hashed passwords
- Google login creates a Firestore user record automatically if it does not exist
- User role is stored in the NextAuth JWT/session payload

### 2. Bin Monitoring

- The app subscribes to the `bins` collection in Firestore
- Each bin record drives dashboard cards, monitoring cards, and management tables
- Bin health is derived mainly from:
  - `status`: `on` or `off`
  - `level`: fill percentage

### 3. Notifications

- Notifications are derived from live bin data instead of being persisted as full notification documents
- A notification exists when a bin is full (`level >= 90`)
- Read state is stored separately in the `notificationRead` collection
- If a bin is no longer full, its read marker is cleaned up

### 4. History and Analytics

- The app syncs bin snapshots into `bin_history` on an hourly basis
- Analytics pages compute trends, peak times, and frequently full locations from that historical data

## Routes

### Public / auth routes

- `/auth/login`
- `/auth/register`

### Main app routes

- `/` - dashboard
- `/monitoring` - live bin monitoring
- `/monitoring/[id]` - bin detail / action page
- `/manage` - bin management
- `/notifications` - derived alerts
- `/history` - analytics and historical trends
- `/analytics` - analytics page entry present in the repo

### API routes

- `/api/register`
- `/api/auth/[...nextauth]`

## Firestore Collections

The codebase currently implies these collections:

### `bins`

Primary live device/bin data.

Expected fields commonly used in the UI:

- `id: string`
- `gedung: string`
- `lantai: string`
- `ruang: string`
- `capacity: string | number`
- `level: number`
- `status: 'on' | 'off'`
- `lastUpdate`
- `location` in some history flows

### `users`

Application users for credentials and Google sign-in.

Common fields:

- `email`
- `fullName`
- `password` (nullable for Google accounts)
- `role`
- `createdAt`

### `notificationRead`

Stores read/unread state for derived notifications.

Common fields:

- `notificationId`
- `readAt`

### `bin_history`

Hourly snapshot data for analytics.

Common fields:

- `binId`
- `location`
- `capacity`
- `timestamp`
- `source`

## Environment Variables

Create a local environment file:

```bash
cp .env.example .env.local
```

Required variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

NEXTAUTH_SECRET=
NEXTAUTH_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Data Model Notes

Two details are worth knowing before extending the app:

1. Some features use `capacity` as literal bin capacity, while history code appears to use it as an analytics value. Verify the intended meaning before changing analytics logic.
2. Some screens build location from `gedung`, `lantai`, and `ruang`, while history sync also references a `location` field directly. Keeping those formats consistent will make the app easier to maintain.

## Auth and Access Notes

- Middleware currently only matches `/admin/:path*`
- Most page-level auth protection is handled inside pages with `useSession`
- There is commented-out role logic in middleware, so role-based access control looks planned but not fully enforced globally yet

## Known Gaps

- `README.md` was previously still the default Next.js template
- Some notification code exists in commented legacy form and is no longer the active path
- `notificationReadService.subscribeToReadNotifications` is not a full real-time subscription yet
- The repo contains a `.env.local`; secrets should stay out of version control

## Suggested Next Improvements

- Add Firestore security rules documentation
- Document the exact bin schema used by the device side
- Clarify user roles and access policy
- Add deployment steps for Vercel or your chosen host
- Add architecture diagrams for device-to-database data flow
