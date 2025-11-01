# 🌈 Ruang Rona

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Coverage](https://img.shields.io/badge/coverage-85%25-yellow.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

**Platform Kesehatan Mental untuk Remaja Indonesia** 🧠💙

*Ruang Rona adalah platform digital yang menyediakan dukungan kesehatan mental, latihan mindfulness, dan tracking mood untuk membantu remaja Indonesia mengelola emosi dan kesejahteraan mental mereka.*

[Report Bug](https://github.com/yourusername/ruang-rona/issues) · [Request Feature](https://github.com/yourusername/ruang-rona/issues)

</div>

---

## 📑 Table of Contents

- [About The Project](#-about-the-project)
    - [Problem Statement](#problem-statement)
    - [Our Solution](#our-solution)
    - [Key Features](#-key-features)
    - [Built With](#️-built-with)
- [Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)
- [Acknowledgments](#-acknowledgments)

---

## 🎯 About The Project

### Problem Statement

Kesehatan mental remaja di Indonesia menghadapi tantangan serius:
- **1 dari 5 remaja** mengalami masalah kesehatan mental (WHO, 2023)
- **Stigma sosial** membuat remaja enggan mencari bantuan
- **Keterbatasan akses** ke layanan konseling profesional
- **Kurangnya literasi** tentang kesehatan mental di kalangan remaja
- **Minimnya tools** untuk self-help dan monitoring kesejahteraan mental

### Our Solution

**Ruang Rona** adalah platform digital yang memberikan ruang aman bagi remaja untuk:
- 🧘 Melakukan latihan kesehatan mental (mindfulness, breathing exercises, journaling)
- 📊 Memantau mood dan progress kesejahteraan mental
- 📚 Mengakses artikel edukatif tentang kesehatan mental
- 💬 Mendapatkan dukungan dari komunitas sebaya
- 🎯 Mengatur goals personal untuk self-improvement

### ✨ Key Features

- 🎨 **Mood Tracker** - Catat dan visualisasi mood harian dengan insights AI
- 🧘‍♀️ **Exercise Library** - 50+ latihan kesehatan mental (meditasi, breathing, journaling)
- 📈 **Progress Dashboard** - Pantau perkembangan kesehatan mental dari waktu ke waktu
- 📚 **Educational Content** - Artikel dan video edukatif tentang kesehatan mental
- 🏆 **Gamification** - Sistem badge dan streak untuk meningkatkan motivasi
- 🔔 **Smart Reminders** - Pengingat personal untuk latihan dan check-in harian
- 🌙 **Dark Mode** - Interface yang nyaman untuk mata
- 🔒 **Privacy First** - Data terenkripsi dan privasi terjaga
- 📱 **Responsive Design** - Akses dari smartphone, tablet, atau desktop
- 🇮🇩 **Bahasa Indonesia** - Interface dan konten dalam bahasa Indonesia

### 🛠️ Built With

**Frontend:**
- [React](https://react.dev/) - UI Library
- [Next.js 14](https://nextjs.org/) - React Framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Component Library
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Chart.js](https://www.chartjs.org/) - Data Visualization

**Backend:**
- [Node.js](https://nodejs.org/) - Runtime Environment
- [Express.js](https://expressjs.com/) - Web Framework
- [Prisma](https://www.prisma.io/) - ORM
- [MySQL](https://www.mysql.com/) - Database
- [JWT](https://jwt.io/) - Authentication
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Password Hashing

**DevOps & Tools:**
- [Vercel](https://vercel.com/) - Deployment (Frontend)
- [Railway](https://railway.app/) - Deployment (Backend)
- [PlanetScale](https://planetscale.com/) - Database Hosting
- [GitHub Actions](https://github.com/features/actions) - CI/CD
- [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) - Code Quality

---

## 🚀 Getting Started

### Prerequisites

Pastikan sistem Anda memenuhi requirements berikut:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 9.0.0 atau **pnpm** >= 8.0.0
- **MySQL** >= 8.0 ([Download](https://dev.mysql.com/downloads/))
- **Git** ([Download](https://git-scm.com/))

Verifikasi instalasi:
```bash
node --version  # v18.0.0 atau lebih tinggi
npm --version   # v9.0.0 atau lebih tinggi
mysql --version # v8.0 atau lebih tinggi
