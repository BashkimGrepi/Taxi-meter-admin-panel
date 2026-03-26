# Taxi Meter Admin Dashboard

> **⚠️ Development Notice:** This project is currently in development mode. Several features and components are subject to change as the platform evolves.

## Overview

The Taxi Meter Admin Dashboard is a multi-tenant SaaS web application designed for taxi companies to monitor and manage their business operations in real time.

This platform acts as a control center for taxi entrepreneurs, providing visibility into:

- Ride activity and operational status
- Revenue and financial performance
- Payment processing and system health
- Driver activity and workforce management
- Pricing configuration and business rules

The dashboard is built as a professional B2B operational tool — focused on clarity, real-time awareness, and financial transparency.

---

## Purpose

The goal of this project is to provide taxi companies with:

- Situational awareness of daily operations
- Full financial visibility and payment tracking
- Confidence in payment provider integrations (Stripe / Viva)
- Workforce and pricing control
- Clean and structured analytics

The dashboard is read-only and insight-focused. Management actions (editing drivers, pricing, etc.) are handled on dedicated pages.

---

## Architecture

This Admin Dashboard is part of a larger Taxi Meter SaaS ecosystem.

It connects to a backend API that:

- Handles authentication and multi-tenant isolation
- Manages rides and pricing logic
- Processes payments
- Stores driver and company data
- Tracks webhooks and payment events

All dashboard data is tenant-scoped and securely retrieved via authenticated API requests.

---

## Demo & Local Testing

To test this frontend locally with demo data, you need to run the backend API.

You can clone the backend repository here:

**Backend Repository:**  
https://github.com/BashkimGrepi/typescriptVersion_taxi-meter_backend.git
After cloning the backend:

- Follow the instructions in the README file

Once the backend is running, update your frontend `.env` file:

```
VITE_API_BASE_URL=http://localhost:3000
```

Then start the frontend:

```bash
npm install
npm run dev
```

You will now be able to log in and test the dashboard using seeded demo data.

---

## Key Features

- Multi-tenant architecture
- Real-time dashboard overview
- Ride performance monitoring
- Payment tracking (Stripe / Viva)
- Driver management insights
- Pricing awareness
- Operational alerts and system health

---

## Development Status

The project is built incrementally in structured phases:

1. Dashboard (Overview)
2. Rides Management
3. Payments & Transactions
4. Driver Management
5. Pricing & Business Rules
6. Provider Linking & Settings
7. Advanced Reporting

---

<sub>_This documentation has been enhanced with AI assistance._</sub>
