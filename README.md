# Evocentric 🚗⚡

## Smart EV Charging & Parking Management System

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E?logo=supabase)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.18-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A modern, full-stack web application for managing city-wide EV charging stations with real-time updates, comprehensive database management, and beautiful UI powered by Poppins font family.

---

## 📸 Screenshots

_Dashboard with comprehensive statistics and real-time activity_

---

## ✨ Features

### 🎯 Core Functionality

- **Live Dashboard** - Real-time statistics, occupancy rates, slot availability, and activity monitoring
- **User Management** - Complete CRUD operations with wallet balance tracking
- **Charging Station Management** - Monitor stations, slots, and real-time availability
- **Reservation System** - Track and manage EV charging reservations with status updates
- **Penalty Tracking** - Monitor violations, fines, and payment status
- **Real-time Updates** - Live data synchronization using Supabase subscriptions
- **Advanced Analytics** - Occupancy rates, user statistics, and performance metrics

### 🎨 UI/UX

- **Responsive Design** - Mobile-first, works on all devices
- **Modern Interface** - Clean design with Poppins font family
- **Shadcn UI Components** - Beautiful, accessible components
- **Interactive Visualizations** - Progress bars, status badges, color-coded stats
- **Smooth Animations** - Hover effects and transitions
- **Dark Mode Ready** - Theme system in place

### ⚡ Technical Features

- **Vite** - Lightning-fast dev server and builds
- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Supabase** - Powerful backend with PostgreSQL
- **Row Level Security** - Database-level security
- **Real-time Subscriptions** - WebSocket connections
- **Optimized Queries** - Indexed database columns
- **Client-side Routing** - React Router v7

---

## 📋 Table of Contents

- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Development](#-development)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔧 Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** / **yarn** / **pnpm**
- **Supabase Account** ([Sign up](https://supabase.com))
- **Git** ([Download](https://git-scm.com/))

---

## 🚀 Quick Start

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/evocentric.git
cd evocentric
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Setup

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4️⃣ Database Setup

Run the SQL files in your Supabase SQL Editor:

```sql
-- 1. Run schema.sql to create tables
-- 2. Run seed.sql to add sample data
```

Files are located in `database/` directory.

### 5️⃣ Start Development Server

```bash
npm run dev
```

Visit **http://localhost:5173** 🎉

---

## 📁 Project Structure

```
evocentric/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ui/             # Shadcn UI components
│   │   │   └── card.jsx
│   │   ├── Sidebar.jsx     # Navigation sidebar
│   │   └── Topbar.jsx      # Top navigation bar
│   ├── pages/              # Page components
│   │   ├── Dashboard.jsx   # Main dashboard (Enhanced!)
│   │   ├── Users.jsx       # User management
│   │   ├── Stations.jsx    # Charging stations
│   │   ├── Reservations.jsx # Reservations
│   │   └── Penalties.jsx   # Penalties
│   ├── lib/                # Utilities
│   │   ├── supabaseClient.js # Supabase config
│   │   └── utils.js        # Helper functions
│   ├── assets/             # Static assets
│   ├── App.jsx             # Main app
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles (Poppins font!)
├── database/               # Database files
│   ├── schema.sql         # Complete schema
│   └── seed.sql           # Sample data
├── docs/                   # Documentation
│   └── API.md             # API documentation
├── public/                 # Public assets
├── .env.example           # Environment template
├── .gitignore            # Git ignore
├── package.json          # Dependencies
├── tailwind.config.cjs   # Tailwind config
├── vite.config.ts        # Vite config
├── CONTRIBUTING.md       # Contribution guide
├── CHANGELOG.md          # Version history
├── LICENSE               # MIT License
└── README.md             # This file
```

---

## 🗄️ Database Schema

### Tables Overview

| Table               | Primary Key      | Description               |
| ------------------- | ---------------- | ------------------------- |
| `users`             | `user_id`        | User accounts with wallet |
| `charging_stations` | `station_id`     | EV charging locations     |
| `reservations`      | `reservation_id` | Slot reservations         |
| `penalties`         | `penalty_id`     | Fines and violations      |

### Entity Relationships

```
users (user_id)
  ├── 1:N → reservations (user_id)

charging_stations (station_id)
  ├── 1:N → reservations (slot_id)

reservations (reservation_id)
  ├── 1:N → penalties (reservation_id)
```

### Key Features

- ✅ Foreign key constraints
- ✅ Check constraints for data integrity
- ✅ Indexes for performance
- ✅ Triggers for auto-updates
- ✅ Views for analytics
- ✅ Row Level Security (RLS)

📚 **Full schema details:** [DATABASE_NOTES.md](DATABASE_NOTES.md)

---

## 🛠️ Development

### Available Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Lint code
npm run type-check   # TypeScript check

# Database
# Run SQL files in Supabase SQL Editor
```

### Tech Stack

| Category       | Technology              |
| -------------- | ----------------------- |
| **Frontend**   | React 19, TypeScript    |
| **Styling**    | Tailwind CSS, Shadcn UI |
| **Backend**    | Supabase (PostgreSQL)   |
| **Build Tool** | Vite 7                  |
| **Routing**    | React Router 7          |
| **Icons**      | Lucide React            |
| **Font**       | Poppins (Google Fonts)  |

### Code Style

- ✅ 2 spaces indentation
- ✅ Single quotes for strings
- ✅ Semicolons
- ✅ Arrow functions
- ✅ Async/await
- ✅ Template literals
- ✅ JSDoc comments

---

## 📖 API Documentation

### Supabase Client Usage

```javascript
import { supabase } from "./lib/supabaseClient";

// Fetch data
const { data, error } = await supabase.from("users").select("*");

// Real-time subscription
const channel = supabase
  .channel("changes")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "users" },
    (payload) => console.log(payload)
  )
  .subscribe();
```

📚 **Full API docs:** [docs/API.md](docs/API.md)

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy Options

| Platform         | Command                                                      |
| ---------------- | ------------------------------------------------------------ |
| **Vercel**       | `vercel --prod`                                              |
| **Netlify**      | `netlify deploy --prod`                                      |
| **GitHub Pages** | See [Vite docs](https://vitejs.dev/guide/static-deploy.html) |

### Environment Variables

Set these in your hosting platform:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Production Checklist

- [ ] Update Supabase RLS policies
- [ ] Add authentication
- [ ] Configure CORS
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Add error tracking
- [ ] Optimize images
- [ ] Enable compression

---

## 🎨 Customization

### Change Theme Colors

Edit `src/index.css`:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  /* ... */
}
```

### Change Font

Already using **Poppins** throughout! To change:

1. Update `index.html` Google Fonts link
2. Update `tailwind.config.cjs` fontFamily
3. Update `src/index.css` body font

---

## 🤝 Contributing

We love contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Code of Conduct
- Development setup
- Pull request process
- Coding standards

---

## 📝 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with amazing open-source tools:

- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Supabase](https://supabase.com/) - Backend platform
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn UI](https://ui.shadcn.com/) - Components
- [Lucide](https://lucide.dev/) - Icons
- [Google Fonts](https://fonts.google.com/) - Poppins font

---

## 📞 Support & Contact

- 📧 **Email:** support@evocentric.com
- 🐛 **Issues:** [GitHub Issues](https://github.com/yourusername/evocentric/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/yourusername/evocentric/discussions)
- 📖 **Documentation:** [docs/](docs/)

---

## 🎯 Roadmap

### Phase 1 (Current)

- [x] Core CRUD operations
- [x] Real-time updates
- [x] Enhanced dashboard
- [x] Poppins font integration
- [x] Proper documentation

### Phase 2 (Next)

- [ ] User authentication & authorization
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Export functionality

### Phase 3 (Future)

- [ ] Mobile app (React Native)
- [ ] Admin panel
- [ ] Multi-language support
- [ ] Dark mode
- [ ] PWA support
- [ ] AI-powered recommendations

---

## ⭐ Star History

If you find this project useful, please consider giving it a star! ⭐

---

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/evocentric?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/evocentric?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/yourusername/evocentric?style=social)

---

<div align="center">

**Made with ❤️ for modern city infrastructure management**

[⬆ Back to Top](#evocentric-)

</div>
