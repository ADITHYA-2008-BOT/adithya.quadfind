# Quad Find — AI-Powered Smart Campus Lost & Found Platform

Quad Find is a responsive, modern web application designed for university and college campuses to reconnect lost belongings with their owners through intelligent multi-factor AI matching.

## 🚀 How to Run Locally

### Option 1: Using the PowerShell Web Server
In PowerShell, navigate to this folder and run:
```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```
Then open your browser to:
👉 **[http://localhost:8080/](http://localhost:8080/)**

### Option 2: Direct File Open
You can open `index.html` directly in Google Chrome, Microsoft Edge, or any modern web browser.

---

## 🌟 Key Features

1. **Multi-Factor AI Matching Engine (`js/aiMatcher.js`)**
   - **Semantic & Description Analysis (38%)**: Token extraction, brand & model recognition, color match.
   - **Visual & Photo Alignment (27%)**: Color profile similarity, visual cues (stickers, clips, casing).
   - **Campus Spatial Proximity (20%)**: Distance matrix across 7 campus buildings & zones.
   - **Temporal Proximity (15%)**: Time-delta decay evaluation.
   - **Natural Language Explanations**: Generates clear, human-readable match summaries.

2. **Interactive Report Submission (`js/components/reportModal.js`)**
   - Step-by-step reporting for **Lost** (Amber) and **Found** (Emerald) items.
   - Photo upload, live preview, and camera snapshot simulation.
   - **1-Click Hackathon Demo Presets** for instant testing.
   - Simulated 3-phase AI neural scanning animation upon submission.

3. **Side-by-Side Match Review & Resolution (`js/components/matchModal.js`)**
   - Side-by-side comparative views with 4-factor score breakdown bars.
   - Safe Exchange Hub selector (Campus Police, Library Desk, Student Union Hub).
   - Generates verified **6-digit Claim Codes** (`QF-XXXXXX`) and updates status to **Resolved**.

4. **Search, Filter & Explore Hub (`js/components/explore.js`)**
   - Real-time search by keyword, category, location, and date.
   - Grid and List view layouts.

5. **Campus Map View (`js/components/campusMap.js`)**
   - Interactive SVG map with building hotspot pins and live item counters.

6. **Dashboard Analytics (`js/components/dashboard.js`)**
   - Live recovery rate meter, AI accuracy statistics, and top match candidates.

---

## 📁 Project Structure

```
adithya.quadfind/
├── index.html                   # Main HTML layout & CDN links
├── serve.ps1                    # Local PowerShell HTTP web server
├── README.md                    # Project documentation
├── css/
│   └── styles.css               # Custom styles & animations
└── js/
    ├── app.js                   # Application coordinator & routing
    ├── data.js                  # Seed dataset & campus building definitions
    ├── aiMatcher.js             # Multi-factor AI matching engine
    ├── state.js                 # Reactive state store & LocalStorage sync
    └── components/
        ├── dashboard.js         # KPI metrics & match showcase
        ├── explore.js           # Search & filter cards/list
        ├── aiHub.js             # AI Matches Hub matrix
        ├── campusMap.js         # Interactive SVG campus map
        ├── reportModal.js       # Report submission dialog & AI scanner
        ├── matchModal.js        # Side-by-side comparison & handshake
        ├── itemDetailModal.js   # Single item details
        └── toasts.js            # Toast notification system
```
