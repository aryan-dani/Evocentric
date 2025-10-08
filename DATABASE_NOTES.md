# Database Schema Notes

## ⚠️ Important: Missing Table

The `parking_lots` table referenced in `src/pages/Parking.jsx` **does not exist** in your Supabase database.

### Options:

1. **Remove the Parking feature** - Delete `Parking.jsx` and remove it from navigation
2. **Create the parking_lots table** - Run this SQL in Supabase:

```sql
CREATE TABLE parking_lots (
  parking_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location TEXT NOT NULL,
  total_spaces INTEGER NOT NULL,
  available_spaces INTEGER NOT NULL,
  hourly_rate NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Database Schema Summary

### Users Table

- Primary Key: `user_id` (not `id`)
- Columns: `name`, `email`, `phone`, `wallet_balance`, `created_at`, `updated_at`
- ❌ Frontend was using: `vehicle_number`, `payment_method` (don't exist)

### Charging Stations Table

- Primary Key: `station_id` (not `id`)
- Columns: `station_name` (not `name`), `location`, `total_slots` (not `total_ports`), `available_slots` (not `available_ports`), `created_at`, `updated_at`
- ❌ Frontend was using: `status` field (doesn't exist)

### Reservations Table

- Primary Key: `reservation_id` (not `id`)
- Columns: `user_id`, `slot_id` (not `station_id` and `slot_number`), `start_time`, `end_time`, `status`, `overstay_penalty`, `created_at`, `updated_at`
- ❌ Frontend was using: `payment_status` (doesn't exist)
- ❌ Frontend tried to join with `charging_stations` on `station_id`

### Penalties Table

- Primary Key: `penalty_id` (not `id`)
- Columns: `reservation_id` (not `user_id`), `amount`, `reason`, `status`, `created_at`, `paid_at`
- Penalties are linked to reservations, not directly to users

## All Changes Made

✅ **Users.jsx** - Updated to use `user_id`, removed `vehicle_number` and `payment_method`, added `wallet_balance`
✅ **Stations.jsx** - Updated to use `station_id`, `station_name`, `total_slots`, `available_slots`, removed `status`
✅ **Reservations.jsx** - Updated to use `reservation_id`, `slot_id`, removed `station_id`/`slot_number` split, removed `payment_status`
✅ **Penalties.jsx** - Updated to use `penalty_id`, `reservation_id` instead of `user_id`, proper join with reservations->users
✅ **Dashboard.jsx** - Updated to use correct IDs, removed parking stats
⚠️ **Parking.jsx** - NOT UPDATED - Table doesn't exist in database!

## Recommendations

1. **Create the parking_lots table** if you need parking functionality
2. Consider adding these fields if needed:
   - `status` to `charging_stations` table
   - `payment_status` to `reservations` table
   - `vehicle_number` and `payment_method` to `users` table
3. Update your Row Level Security (RLS) policies if needed
4. Add proper foreign key constraints between tables
