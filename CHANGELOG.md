# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Enhanced dashboard with comprehensive statistics
- Occupancy rate visualization
- Poppins font family throughout the application
- Proper project structure with database/ and docs/ directories
- Complete database schema with triggers and views
- Seed data for testing
- Environment template (.env.example)
- Comprehensive README with badges and documentation
- Contributing guidelines
- MIT License

### Changed

- Updated all components to match actual database schema
- Improved UI with better color coding and hover effects
- Enhanced Recent Activity display with status badges
- Optimized database queries with proper indexes
- Updated Tailwind config to use Poppins as default font

### Fixed

- Database column name mismatches (id vs user_id, station_id, etc.)
- Missing foreign key relationships
- Parking table references (removed non-existent table)
- React key prop warnings in Dashboard
- Null-safe access for joined data

### Removed

- Parking feature (table doesn't exist in current schema)
- Unused icon imports

## [0.1.0] - 2024-10-08

### Added

- Initial project setup with Vite and React
- Supabase integration
- User management system
- Charging station management
- Reservation system
- Penalty tracking
- Real-time updates with Supabase subscriptions
- Responsive design with Tailwind CSS
- Shadcn UI components
- React Router for navigation
- Sidebar and Topbar navigation

### Database

- Users table with wallet balance
- Charging stations table with slot tracking
- Reservations table with foreign keys
- Penalties table linked to reservations
- Row Level Security (RLS) policies
- Indexes for performance optimization

### UI/UX

- Clean and modern interface
- Card-based layouts
- Modal forms for CRUD operations
- Search and filter functionality
- Status badges and indicators
- Loading states
- Empty states

[Unreleased]: https://github.com/yourusername/evocentric/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/yourusername/evocentric/releases/tag/v0.1.0
