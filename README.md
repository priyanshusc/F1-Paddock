# 🏎️ Pitwall (F1-Paddock)

**Pitwall** (also known as *F1-Paddock*) is a high-performance Formula 1 dashboard built with **Next.js 14**, designed to provide a real-time, data-driven look at the **2026 F1 Season**.  

This project blends current racing technology with a forward-looking *"lore"* that features the anticipated 2026 grid, including **Lewis Hamilton at Ferrari** and **Kimi Antonelli at Mercedes**.

---

## 🚀 Overview

The dashboard serves as a central hub for F1 enthusiasts, offering everything from championship standings to granular session data.  

It is engineered for **speed and precision**, leveraging modern web technologies to handle:
- High-frequency data updates  
- Complex global timezones  

---

## ✨ Key Features

### 🟢 "Lights Out" Countdown
A live, high-precision countdown to the next Grand Prix, featuring **UTC-stable logic** to ensure accurate timing regardless of the viewer's location.

### 🔄 Hybrid Data Engine
An intelligent data layer that:
- Fetches real-time statistics from **Jolpica (Ergast)** and **OpenF1 APIs**
- Maintains a robust fallback system for **2026-themed results**

### 📊 Dynamic Standings
Visualized championship tables for:
- Drivers  
- Constructors  

Includes:
- Dynamic team coloring  
- Gap analysis  

### 📅 Interactive Season Calendar
A horizontal scrolling strip that tracks the **23-round season**, identifying:
- Completed races  
- Upcoming events  
- Future rounds  

### 📰 Paddock News & Lore
A dedicated section for **2026 season narrative updates**, such as:
- Cadillac’s entry  
- Technical developments at Red Bull Ford  

### 📡 Live Ticker
A scrolling data ribbon providing instant access to:
- WDC leaders  
- Fastest lap records  
- Rookie standings  

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)  
- **Library:** React 18  
- **Styling:** Tailwind CSS v3 + PostCSS + Autoprefixer  
- **Icons:** Lucide React  
- **Data Fetching:** Native `fetch` with **Incremental Static Regeneration (ISR)**  

---

## 🏗️ Architecture & Optimization

### ⚡ Memoization
Uses `useMemo` to:
- Stabilize complex date calculations  
- Prevent infinite re-render loops  
- Maintain smooth **60fps UI**

### 🌍 Global Accuracy
Employs **UTC-based date methods** to handle race weekend windows correctly, including cross-month scenarios (e.g., April 30 – May 03).

### 🛡️ API Resilience
Implements a `try...catch` strategy to:
- Fetch live API data when available  
- Seamlessly switch to static fallback data if APIs fail  

---

## 🏁 Getting Started

### 📌 Prerequisites

- Node.js **18.x or later**  
- npm or yarn  

---

### ⚙️ Installation

#### 1. Clone the repository
```bash
git clone https://github.com/priyanshusc/F1-Paddock.git
cd pitwall
```
### 2. Install dependencies
```bash
npm install
```
### 3. Run the development server
```bash
npm run dev
```
### 🌐 Open in Browser
Visit: http://localhost:3000

### 📄 License
This project is private and intended for portfolio demonstration purposes.
