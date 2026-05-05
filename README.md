# REUX – AI-Powered Academic Evaluation Platform

REUX is a production-grade academic evaluation system built for **Sri College of Engineering**. It leverages Google Gemini 1.5 Flash AI to evaluate students based on conceptual understanding and reasoning, moving beyond rote memorization.

## 🚀 Features

- **🧠 AI Evaluation Engine**: Automated scoring of subjective answers with deep conceptual analysis via **Groq Llama 3**.
- **🛡️ Anti-Cheat System**: Tab switch tracking, copy-paste disabling, and proctoring logs.
- **📊 Performance Analytics**: Visual dashboards for students and teachers using Recharts.
- **🎯 Weak Concept Detection**: Automated identification of learning gaps per student.
- **📤 Export & Reports**: Generate professional PDF result cards and Excel performance reports.
- **🔔 Notifications**: Real-time in-app and email alerts for exams and results.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v3, Zustand, Axios.
- **Backend**: Node.js 20, Express.js, Drizzle ORM.
- **Database**: PostgreSQL (Neon Serverless).
- **AI**: Groq (Llama 3 70B).
- **Auth**: JWT (Access + Refresh Tokens) + Bcrypt.
- **Reporting**: jsPDF, SheetJS (XLSX).

## 🏁 Getting Started

### Prerequisites
- Node.js 20+
- Neon DB account
- Google Gemini API Key
- Cloudinary Account (for images)
- SendGrid API Key (for emails)

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-repo/reux.git
   cd reux
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Setup Environment Variables**
   Create a `.env` file in the root (refer to `.env.example`).

4. **Run Migrations**
   ```bash
   npm run db:migrate
   ```

5. **Seed Database**
   ```bash
   npm run db:seed
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🔐 Credentials (Default Seed)
- **Admin**: admin@reux.app / Admin@123
- **Teacher**: teacher1@reux.app / Teacher@123
- **Student**: student1@reux.app / Student@123

## 🌍 Deployment

- **Backend**: Render / Railway
- **Frontend**: Vercel / Netlify
- **Database**: Neon DB

---
Built for **Sri College of Engineering** | Version 1.0 Production Ready
