# Rent & Housing Stability Assistant (HSA)

The **Rent & Housing Stability Assistant (HSA)** is a mobile-first web application designed for Bay Area tenants and small landlords to navigate complex California rental regulations, notice procedures, habitability guidelines, and dispute resolutions. 

By providing automated notice audits, rent cap calculators, letter generators, evidence timeline builders, and resource navigation, the assistant reduces legal friction and helps prevent avoidable evictions.

---

## 🚀 Key Features

*   **Multimodal Notice Interpreter:** Scan eviction notices (via photo camera capture or PDF/Image uploads) or paste notice text directly. The AI calculates response deadlines (excluding weekends/holidays) and audits the notice text for legal compliance under California and local laws (e.g. San Jose ARO, SF Rent Ordinance).
*   **Rent Increase Validator:** Calculates maximum allowable rent increases using the pre-1979 municipal caps (5% for San Jose, 1.7% for SF, 2.3% for Oakland) or the statewide **AB 1482** cap (8.8% for the Bay Area in 2026).
*   **Repair Obligation Navigator:** Explains legal timelines (24-72 hrs for emergency utilities, 30 days for routine maintenance) and rights (like *Repair & Deduct*) for plumbing, heating, mold, pests, and wiring issues under California Civil Code Section 1941.1.
*   **Document & Response Generator:** Auto-drafts formal, legally-grounded letters (e.g. Repair Requests, Rent Dispute objections, landlord 24-hr Entry Notices) optimized for physical printing.
*   **Chronological Timeline Builder:** Log tenancy events, communications, leaks, and payments to export as a clean printable PDF report for legal aid clinics or mediation boards.
*   **Assistance Program Navigator:** Filterable directory of major local resources (Sacred Heart Community Service, Law Foundation of Silicon Valley, Bay Area Legal Aid, SF Eviction Defense Collaborative).

---

## 🛠 Tech Stack

*   **Frontend Framework:** Next.js 16 (React 19 + App Router)
*   **Programming Language:** TypeScript
*   **Styling:** Premium Vanilla CSS design system (fully localized Tenant vs Landlord palettes)
*   **Database ORM:** Drizzle ORM
*   **Database Provider:** Neon Postgres (serverless HTTP connection driver)
*   **Generative AI SDK:** `@google/generative-ai` (Gemini 1.5 Flash)

---

## 💻 Local Development Setup

To get a local development environment running:

### 1. Clone & Install Dependencies
```bash
git clone git@github.com:ranjanr/hsa.git
cd hsa
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root of the project:
```env
# Connection string for Neon Postgres Database
DATABASE_URL="postgresql://your_user:your_password@your_host/your_db?sslmode=require"
```
> **Note:** If `DATABASE_URL` is omitted, the application will automatically fall back to **Local Storage Mode** for saving notices, timeline events, and letters, allowing instant local testing without setting up a database.

### 3. Push Database Schema
If you have configured `DATABASE_URL`, push the database schema definitions to your Neon database instance:
```bash
npx drizzle-kit push
```

### 4. Configure Gemini API Key
To enable live AI-based document scanning and letter polishing:
1. Start the application.
2. Click the **Settings Gear Icon** in the top-right corner of the header.
3. Paste your Gemini API key (saved securely in your browser's local memory).
> **Note:** If no key is entered, the app runs in **Simulation Mode** using high-fidelity pre-templated rules to analyze notices and letters, making it ideal for offline demos.

### 5. Run the Local Server
Start the development server:
```bash
npm run dev
# or run on a specific port
npx next dev -p 5432
```
Open [http://localhost:5432](http://localhost:5432) in your browser.

---

## 📂 Project Structure

```
/hsa
├── public/
│   └── logo.png             # Brand logo asset (shield + house + scales)
├── src/
│   ├── app/
│   │   ├── dbActions.ts     # Next.js Server Actions connecting to Neon
│   │   ├── globals.css      # Custom vanilla CSS design system & portal variables
│   │   ├── layout.tsx       # Main App Router layout
│   │   └── page.tsx         # Dashboard portal router & Landing View
│   ├── components/
│   │   ├── Footer.tsx       # Reusable 3-column bilingual footer
│   │   ├── SettingsModal.tsx# API Key & region config overlay
│   │   ├── NoticeInterpreter.tsx # Camera capture notice scanner
│   │   ├── RentValidator.tsx# Rent cap calculator
│   │   ├── RepairsNavigator.tsx  # Habitability timelines & remedies navigator
│   │   ├── LetterGenerator.tsx   # Custom letter output generator
│   │   ├── TimelineBuilder.tsx   # Chronological log recorder
│   │   └── ResourceNavigator.tsx # Filterable assistance program directory
│   ├── constants/
│   │   └── resources.ts     # Local legal clinics and relief groups directory
│   ├── db/
│   │   ├── index.ts         # Neon database client adapter
│   │   └── schema.ts        # Database tables schema using Drizzle
│   ├── hooks/
│   │   └── useGemini.ts     # Gemini SDK client hook with fallback OCR engine
│   └── utils/
│       ├── rentCalculator.ts# Rent Cap legal formulas
│       ├── session.ts       # UUID browser sessionId generator
│       └── ...
├── drizzle.config.ts        # Drizzle migration config
├── tsconfig.json            # TypeScript settings
└── package.json             # NPM dependencies map
```

---

## ⚖️ Legal Disclaimer
This application is designed to provide automated legal self-help and educational resources. The recommendations, timeline audits, and calculated caps do not constitute formal legal representation. Users are strongly advised to verify their situation with local tenant unions, legal aid clinics, or a licensed housing attorney.
