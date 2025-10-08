# City-Wide Smart EV Charging and Parking DBMS

A modern, full-stack web application for managing city-wide EV charging stations and parking lots with real-time updates, built with React, Tailwind CSS, and Supabase.

## 🚀 Features

- **Live Dashboard** - Real-time statistics and recent activity monitoring
- **User Management** - Complete CRUD operations for managing users
- **Charging Stations** - Manage charging stations with port availability tracking
- **Parking Lots** - Monitor and manage parking spaces with occupancy rates
- **Reservations** - Track and manage reservations with search functionality
- **Penalties** - Monitor penalties with payment status tracking
- **Real-time Updates** - Live data synchronization using Supabase subscriptions
- **Responsive Design** - Mobile-friendly UI with Tailwind CSS
- **Modern UI** - Clean interface using Shadcn UI components

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd Evocentric
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase Database**

   Run the following SQL in your Supabase SQL Editor:

   ```sql
   -- Create Users Table
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     phone VARCHAR(20),
     vehicle_number VARCHAR(50),
     payment_method VARCHAR(50),
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Create Charging Stations Table
   CREATE TABLE charging_stations (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     location VARCHAR(255) NOT NULL,
     total_ports INTEGER NOT NULL,
     available_ports INTEGER NOT NULL,
     status VARCHAR(50) DEFAULT 'active',
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Create Parking Lots Table
   CREATE TABLE parking_lots (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     location VARCHAR(255) NOT NULL,
     total_spaces INTEGER NOT NULL,
     available_spaces INTEGER NOT NULL,
     hourly_rate DECIMAL(10, 2) NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Create Reservations Table
   CREATE TABLE reservations (
     id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
     station_id INTEGER REFERENCES charging_stations(id) ON DELETE CASCADE,
     slot_number VARCHAR(10) NOT NULL,
     start_time TIMESTAMP NOT NULL,
     end_time TIMESTAMP NOT NULL,
     status VARCHAR(50) DEFAULT 'active',
     payment_status VARCHAR(50) DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Create Penalties Table
   CREATE TABLE penalties (
     id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
     reason TEXT NOT NULL,
     amount DECIMAL(10, 2) NOT NULL,
     status VARCHAR(50) DEFAULT 'unpaid',
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Enable Row Level Security (RLS)
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE charging_stations ENABLE ROW LEVEL SECURITY;
   ALTER TABLE parking_lots ENABLE ROW LEVEL SECURITY;
   ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
   ALTER TABLE penalties ENABLE ROW LEVEL SECURITY;

   -- Create policies for public access (for development)
   CREATE POLICY "Enable all operations for all users" ON users FOR ALL USING (true);
   CREATE POLICY "Enable all operations for all users" ON charging_stations FOR ALL USING (true);
   CREATE POLICY "Enable all operations for all users" ON parking_lots FOR ALL USING (true);
   CREATE POLICY "Enable all operations for all users" ON reservations FOR ALL USING (true);
   CREATE POLICY "Enable all operations for all users" ON penalties FOR ALL USING (true);

   -- Insert Sample Data
   INSERT INTO users (name, email, phone, vehicle_number, payment_method) VALUES
   ('John Doe', 'john@example.com', '555-0001', 'ABC123', 'Credit Card'),
   ('Jane Smith', 'jane@example.com', '555-0002', 'XYZ789', 'Debit Card'),
   ('Bob Johnson', 'bob@example.com', '555-0003', 'DEF456', 'PayPal');

   INSERT INTO charging_stations (name, location, total_ports, available_ports, status) VALUES
   ('Downtown Station', '123 Main St', 10, 7, 'active'),
   ('Airport Hub', '456 Airport Rd', 20, 15, 'active'),
   ('Mall Center', '789 Shopping Blvd', 15, 10, 'active');

   INSERT INTO parking_lots (name, location, total_spaces, available_spaces, hourly_rate) VALUES
   ('City Center Parking', '100 Central Ave', 200, 150, 5.00),
   ('Beach Parking', '200 Ocean Dr', 100, 80, 3.50),
   ('Stadium Parking', '300 Sports Way', 500, 400, 7.00);

   INSERT INTO reservations (user_id, station_id, slot_number, start_time, end_time, status, payment_status) VALUES
   (1, 1, 'A1', NOW(), NOW() + INTERVAL '2 hours', 'active', 'paid'),
   (2, 2, 'B3', NOW(), NOW() + INTERVAL '1 hour', 'active', 'pending'),
   (3, 1, 'A5', NOW(), NOW() + INTERVAL '3 hours', 'completed', 'paid');

   INSERT INTO penalties (user_id, reason, amount, status) VALUES
   (1, 'Overstay penalty - 30 minutes', 15.00, 'unpaid'),
   (2, 'Late cancellation fee', 10.00, 'paid'),
   (3, 'Parking violation', 25.00, 'unpaid');
   ```

## 🚀 Running the Application

1. **Development mode**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173` (or the next available port)

2. **Build for production**

   ```bash
   npm run build
   ```

3. **Preview production build**
   ```bash
   npm run preview
   ```

## 📱 Application Structure

```
Evocentric/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   └── card.jsx          # Reusable Card component
│   │   ├── Sidebar.jsx           # Navigation sidebar
│   │   └── Topbar.jsx            # Top navigation bar
│   ├── pages/
│   │   ├── Dashboard.jsx         # Dashboard with stats
│   │   ├── Users.jsx             # User management
│   │   ├── Stations.jsx          # Charging stations
│   │   ├── Parking.jsx           # Parking lots
│   │   ├── Reservations.jsx      # Reservations management
│   │   └── Penalties.jsx         # Penalty tracking
│   ├── lib/
│   │   ├── supabaseClient.js     # Supabase configuration
│   │   └── utils.js              # Utility functions
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── .env.local                    # Environment variables
├── tailwind.config.js            # Tailwind configuration
├── vite.config.ts                # Vite configuration
└── package.json                  # Dependencies
```

## 🎨 Key Technologies

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend as a Service (BaaS)
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **Framer Motion** - Animation library

## 🔑 Key Features Explained

### Real-time Updates

The application uses Supabase's real-time subscriptions to automatically update data across all clients when changes occur in the database.

### CRUD Operations

All major entities (Users, Stations, Parking, Reservations, Penalties) support:

- **Create** - Add new records
- **Read** - View and search records
- **Update** - Edit existing records
- **Delete** - Remove records

### Responsive Design

The application is fully responsive and works seamlessly on:

- Desktop computers
- Tablets
- Mobile devices

## 🔒 Security Notes

**Important**: The sample database policies allow public access for development purposes. For production:

1. Implement proper authentication
2. Update RLS policies to restrict access based on user roles
3. Add input validation and sanitization
4. Use environment variables for sensitive data

## 📝 Environment Variables

| Variable                 | Description                 |
| ------------------------ | --------------------------- |
| `VITE_SUPABASE_URL`      | Your Supabase project URL   |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## 🐛 Troubleshooting

1. **Port already in use**

   - The dev server will automatically try the next available port
   - Or manually specify a port: `npm run dev -- --port 3000`

2. **Supabase connection issues**

   - Verify your `.env.local` file has the correct credentials
   - Check that your Supabase project is active
   - Ensure RLS policies are set up correctly

3. **Build errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Clear cache: `rm -rf .vite && npm run dev`

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ for modern city infrastructure management

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
