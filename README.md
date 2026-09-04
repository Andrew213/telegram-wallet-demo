# Telegram Wallet Mini App

A frontend showcase of a mobile wallet built as a Telegram Mini App.

## Overview

Telegram Wallet Mini App is a sanitized portfolio showcase of a mobile-first wallet frontend. It preserves the original React architecture, routing, hooks, store, themes, i18n setup, and Telegram Mini App integration while replacing production backend integrations with demo services and mock data.

This repository is a sanitized portfolio showcase. Production integrations and proprietary backend services have been replaced with mock data and demo services.

## Features

- Authentication and OTP flow
- Multi-currency wallet
- Transaction history
- Deposits and payouts
- REST-style API architecture with mock services
- Responsive mobile-first UI
- Light and dark themes
- Internationalization with i18next
- Telegram Mini App integration

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- TanStack React Query
- Tailwind CSS
- i18next
- Telegram Mini Apps SDK
- Zod

## Demo Mode

The app runs without a backend. Demo services live in `src/api/mock`, while demo data lives in `src/mocks`.

Use these demo credentials:

- Email: `demo@example.com`
- Password: `Demo12345!`
- OTP: `123456`

Sessions are stored locally for browser demos and through Telegram CloudStorage when available.

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```
