# HolyGlimps 🕉️

HolyGlimps is a modern, distraction-free digital platform for exploring the sacred wisdom of the **Bhagavad Gita**. Built with **Next.js** and **TypeScript**, it offers a seamless reading experience with scholarly interpretations, commentaries, and personalized progress tracking.

---

## ✨ Features

* **Immersive Reading**: A "Snap-to-section" landing page with smooth scroll-snap transitions.
* **Multi-Scholar Perspectives**: Toggle between different translations and deeper scholarly commentaries for every verse.
* **Verse of the Day**: Daily curated wisdom featured directly on the home session.
* **Personalized Progress**: Secure Google Authentication via **NextAuth.js** to track your reading journey and bookmark your last-read position.
* **RapidAPI Integration**: Real-time fetching of Gita chapters and verses from high-quality external API sources.
* **Responsive Design**: Fully responsive UI built with **Tailwind CSS**, supporting both Dark and Light modes.

---

## 🛠️ Tech Stack

| Component            | Technology                                                                 |
| :------------------- | :------------------------------------------------------------------------- |
| **Framework** | [Next.js (Pages Router)](package.json)                                     |
| **Language** | [TypeScript](tsconfig.json)                                                |
| **Database & ORM** | [PostgreSQL](src/db/index.ts) with [Drizzle ORM](src/db/schema.ts)         |
| **Authentication** | [NextAuth.js](src/pages/api/auth/[...nextauth].ts)                         |
| **Styling** | [Tailwind CSS](tailwind.config.ts), [Shadcn UI](components.json)           |
| **State Management** | [Recoil](package.json)                                                     |

---

## 🚀 Local Setup Guide

### Prerequisites

* Node.js 18+
* A PostgreSQL database instance
* RapidAPI Key (Bhagavad Gita API)
* Google OAuth Credentials

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/holyglimps.git
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory and populate it based on `.env.example`.

4.  **Database Migration**
    ```bash
    npx drizzle-kit push
    ```

5.  **Run the development server**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.