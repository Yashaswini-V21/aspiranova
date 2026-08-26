<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=auto&height=220&section=header&text=Aspira%20Nova&fontSize=70&fontColor=ffffff&desc=Proactive%20Respiratory%20Readiness%20and%20Environmental%20Intelligence&descSize=16&descAlignY=70" alt="Aspira Nova Header" width="100%" />
</p>

<div align="center">
  <p>
    <a href="https://aspiranova.lovable.app/"><img src="https://img.shields.io/badge/🚀%20Live%20Demo-aspiranova.lovable.app-14b8a6?style=for-the-badge" alt="Live Demo" /></a>
    &nbsp;&nbsp;
    <a href="#-getting-started-locally"><img src="https://img.shields.io/badge/💻%20Setup%20Guide-Local%20Run-8b5cf6?style=for-the-badge" alt="Local Setup" /></a>
  </p>

  <p align="center" style="margin-top: 15px;">
    <img src="https://img.shields.io/badge/React%2019-%2320232a.svg?style=flat-square&logo=react&logoColor=%2361DAFB" alt="React" />
    &nbsp;
    <img src="https://img.shields.io/badge/TanStack%20Start-%23FF4154.svg?style=flat-square&logo=react&logoColor=white" alt="TanStack Start" />
    &nbsp;
    <img src="https://img.shields.io/badge/Tailwind%20v4-%2338B2AC.svg?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    &nbsp;
    <img src="https://img.shields.io/badge/Supabase-%233ECF8E.svg?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
    &nbsp;
    <img src="https://img.shields.io/badge/OpenAQ-Live%20Data-14b8a6?style=flat-square" alt="OpenAQ" />
  </p>

  <p align="center" style="max-width: 745px; margin: 25px auto 0 auto; line-height: 1.6; color: #444; font-size: 0.98rem;">
    🚀 <b>Project At-A-Glance:</b> Standard air-quality portals tell you a number. <b>Aspira Nova</b> tells you the next action. By converting 5-day particulate forecasts from OpenAQ and Open-Meteo into actionable <b>Readiness Scores</b>, Aspira alerts clinics, pharmacies, and patients to staff up, restock, or protect their health 3 days before pollution peaks.
  </p>
</div>

<hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />








---

## 💡 The Core Problem

Standard air-quality applications display the current AQI or PM2.5 level. But for an asthmatic patient, a clinical staff member, or a pharmacist, **a number is not a decision**. Knowing that PM2.5 is "150 µg/m³" doesn't answer:
- Should my clinic schedule more shift staff tomorrow?
- Do we have enough rescue inhalers in stock for the weekend spike?
- Is it safe for me to go for a run in my specific neighborhood, even if the nearest official station is 20 miles away?

### 🛡️ The Aspira Solution

**Aspira** shifts the paradigm from *reactive reporting* to **predictive readiness**. By translating 5-day particulate forecasts into a single, explainable **Readiness Score** based on correlation studies, Aspira generates decision-shaped guidance across clinic workloads, patient thresholds, and community action plans.

---

## 🚀 Key Modules & Product Features

| Module | Purpose | Actionable Outcome |
| :--- | :--- | :--- |
| **📈 Readiness Dial** | Translates 5-day PM2.5 forecasts into an animated, intuitive Arc Dial. | Tells you the peak respiratory strain day at a glance. |
| **🔍 Smart Region Search** | Integration with **OpenAQ v3** to search and pin global cities dynamically. | Live real-time regional statistics with no API-key setup required. |
| **⚠️ Coverage Awareness** | Analyzes nearby monitoring density. If under 2 official sensors, it flags low-confidence areas. | Automatically alerts users and shifts weight to crowd-sourced symptom reports. |
| **🏥 Clinic Outlook** | Pre-models hospital/clinic intake demand and local inhaler inventory alerts. | Advises clinics to staff up or restock rescue medications 3 days early. |
| **⚡ Personal Alerts** | Threshold-based notifications using plain-language guidance rather than raw metrics. | "Limit outdoor exposure", "Ensure inhaler is refilled by Wednesday". |
| **🗺️ Community Map** | Heatmap visualizer displaying official sensors alongside user crowdsourced symptom check-ins. | Bridges data gaps in rural or under-monitored residential neighborhoods. |

---

## 🛠️ Tech Stack & Architecture

### System Data Flow

```mermaid
graph TD
    User([Browser Client - React 19]) -->|RPC Server Function| Serv[TanStack Start Server Layer]
    Serv -->|Query Live Data| OpenAQ[(OpenAQ API v3 - Live Stations)]
    Serv -->|Query Forecasts| OpenMeteo[(Open-Meteo API - PM2.5 & Geocoding)]
    Serv -->|Fetch Shared State| DB[(PostgreSQL Database + RLS)]
    
    classDef api fill:#1e293b,stroke:#4f46e5,stroke-width:2px,color:#fff;
    classDef client fill:#0f172a,stroke:#06b6d4,stroke-width:2px,color:#fff;
    classDef db fill:#0f172a,stroke:#10b981,stroke-width:2px,color:#fff;
    class OpenAQ,OpenMeteo api;
    class User client;
    class DB db;
```

### Stack Highlight
* **Framework:** **TanStack Start v1** (React 19) — Provides unified server functions (`createServerFn`) and file-based routing. Allows secure table operations without client exposure.
* **Styling:** **Tailwind CSS v4** — Built completely around modern semantic `oklch` design tokens for seamless light/dark rendering with zero layout thrashing.
* **Database & Auth:** **Postgres + RLS (Row Level Security)** — Keeps region configurations synced across pages safely.
* **Charts:** **Recharts** — Tailored client-side rendering for immediate interactive performance.
* **APIs:** Free-tier global coverage through **OpenAQ** and **Open-Meteo**.

---

## 📂 Pristine Repository Structure

To support clean maintenance and decoupled development, all core project files and source codes are segregated under the `aspira/` subdirectory. Only the primary entry details and documentation are kept in the root folder.

```text
.
├── aspira/                  # Complete UI & Backend Codebase
│   ├── src/                 # Client Application Pages, Components & Hooks
│   │   ├── routes/          # TanStack Start File-based Routing
│   │   ├── components/      # Dials, charts, maps, and UI layout primitives
│   │   ├── lib/             # API helpers, server RPCs, data-fetching models
│   │   └── styles.css       # Core design tokens
│   ├── public/              # Production static templates & media
│   ├── supabase/            # Database migrations & schemas
│   ├── package.json         # Project manifests and scripts
│   ├── tsconfig.json        # Strict compilation setups
│   └── vite.config.ts       # Optimized bundler configuration
└── README.md                # Premium Project Overview & Presentation (Root)
```

---

## 💻 Getting Started Locally

All project utilities are located in the `aspira/` folder. Follow these simple commands to run the development server locally:

```bash
# 1. Navigate to the project directory
cd aspira

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The application will launch on [http://localhost:8080](http://localhost:8080).

---

## ✨ Future Enhancements & Clinic Validation
- [ ] **Clinical Model Calibration:** Integrating historical respiratory hospital admissions to refine the predictive Readiness Score weights.
- [ ] **Proactive SMS & Push Notifications:** Automatically alerting high-risk subscribers of looming PM2.5 spikes.
- [ ] **Decentralized Reputation Weighting:** Implementing sybil-resistant voting weights for community symptom reports.

<!-- Premium Visual Footer -->
<br />
<hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />

<div align="center">
  <table style="border: 0; border-collapse: collapse; background: none; margin: 0 auto;">
    <tr style="border: 0; background: none;">
      <td align="center" style="border: 0; padding: 10px;">
        <span style="font-size: 2.2rem;">🕊️</span>
        <h3 style="font-size: 1.4rem; margin-top: 10px; margin-bottom: 5px;">Breathe Ahead of the Forecast</h3>
        <p style="color: #666; font-size: 0.95rem; max-width: 550px; margin: 0 auto; line-height: 1.6;">
          <i>"Crafted in Bengaluru, Karnataka — bridging tech innovation with environmental purpose to secure clean air for every community, one forecast at a time."</i>
        </p>
        <div style="margin-top: 20px;">
          <a href="https://github.com/Yashaswini-V21/aspiranova"><img src="https://img.shields.io/badge/GitHub-Repository-181717?style=flat&logo=github&logoColor=white" alt="GitHub" /></a>
          &nbsp;&nbsp;
          <a href="https://aspiranova.lovable.app/"><img src="https://img.shields.io/badge/Lovable-App-ff4785?style=flat&logo=webflow&logoColor=white" alt="Lovable" /></a>
        </div>
        <p style="font-size: 0.8rem; color: #aaa; margin-top: 20px; font-family: monospace;">
          MIT Licensed © 2026 Aspira Nova · Free and Open-Source Project
        </p>
      </td>
    </tr>
  </table>
  
  <br />
  
  <img src="https://capsule-render.vercel.app/api?type=waving&color=auto&height=120&section=footer" alt="Aspira Nova Footer Wave" width="100%" />
</div>



