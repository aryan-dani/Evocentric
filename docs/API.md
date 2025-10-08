# API Documentation

## Supabase Database API

### Base URL

```
https://[YOUR_PROJECT_ID].supabase.co/rest/v1/
```

### Authentication

All requests require the `apikey` header with your Supabase anon key.

---

## Users API

### Get All Users

```javascript
const { data, error } = await supabase
  .from("users")
  .select("*")
  .order("user_id", { ascending: true });
```

### Get User by ID

```javascript
const { data, error } = await supabase
  .from("users")
  .select("*")
  .eq("user_id", userId)
  .single();
```

### Create User

```javascript
const { data, error } = await supabase.from("users").insert([
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "555-0123",
    wallet_balance: 100.0,
  },
]);
```

### Update User

```javascript
const { data, error } = await supabase
  .from("users")
  .update({
    name: "Jane Doe",
    wallet_balance: 150.0,
  })
  .eq("user_id", userId);
```

### Delete User

```javascript
const { data, error } = await supabase
  .from("users")
  .delete()
  .eq("user_id", userId);
```

---

## Charging Stations API

### Get All Stations

```javascript
const { data, error } = await supabase
  .from("charging_stations")
  .select("*")
  .order("station_id", { ascending: true });
```

### Get Station with Occupancy

```javascript
const { data, error } = await supabase.from("station_occupancy").select("*");
```

### Create Station

```javascript
const { data, error } = await supabase.from("charging_stations").insert([
  {
    station_name: "Downtown Hub",
    location: "123 Main St",
    total_slots: 20,
    available_slots: 20,
  },
]);
```

### Update Station Availability

```javascript
const { data, error } = await supabase
  .from("charging_stations")
  .update({ available_slots: 15 })
  .eq("station_id", stationId);
```

---

## Reservations API

### Get All Reservations with User Info

```javascript
const { data, error } = await supabase
  .from("reservations")
  .select("*, users(name, email)")
  .order("created_at", { ascending: false });
```

### Get Active Reservations

```javascript
const { data, error } = await supabase
  .from("reservations")
  .select("*, users(name)")
  .eq("status", "active")
  .order("start_time", { ascending: true });
```

### Create Reservation

```javascript
const { data, error } = await supabase.from("reservations").insert([
  {
    user_id: 1,
    slot_id: 5,
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    status: "active",
  },
]);
```

### Update Reservation Status

```javascript
const { data, error } = await supabase
  .from("reservations")
  .update({ status: "completed" })
  .eq("reservation_id", reservationId);
```

---

## Penalties API

### Get All Penalties with Reservation and User Info

```javascript
const { data, error } = await supabase
  .from("penalties")
  .select("*, reservations(reservation_id, users(name))")
  .order("created_at", { ascending: false });
```

### Get Unpaid Penalties

```javascript
const { data, error } = await supabase
  .from("penalties")
  .select("*, reservations(reservation_id, users(name, email))")
  .eq("status", "unpaid");
```

### Create Penalty

```javascript
const { data, error } = await supabase.from("penalties").insert([
  {
    reservation_id: 123,
    amount: 25.0,
    reason: "Overstay penalty - 30 minutes",
    status: "unpaid",
  },
]);
```

### Mark Penalty as Paid

```javascript
const { data, error } = await supabase
  .from("penalties")
  .update({ status: "paid" })
  .eq("penalty_id", penaltyId);
// paid_at is automatically set by database trigger
```

---

## Real-time Subscriptions

### Subscribe to Reservations Changes

```javascript
const channel = supabase
  .channel("reservations-changes")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "reservations",
    },
    (payload) => {
      console.log("Change received!", payload);
      // Refresh your data
    }
  )
  .subscribe();

// Don't forget to unsubscribe
return () => {
  supabase.removeChannel(channel);
};
```

### Subscribe to Station Updates

```javascript
const channel = supabase
  .channel("stations-changes")
  .on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "charging_stations",
    },
    (payload) => {
      console.log("Station updated!", payload);
    }
  )
  .subscribe();
```

---

## Database Views

### Station Occupancy View

```javascript
const { data, error } = await supabase.from("station_occupancy").select("*");

// Returns:
// {
//   station_id: 1,
//   station_name: 'Downtown Hub',
//   location: '123 Main St',
//   total_slots: 20,
//   available_slots: 15,
//   occupied_slots: 5,
//   occupancy_rate: 25.00
// }
```

### User Statistics View

```javascript
const { data, error } = await supabase
  .from("user_statistics")
  .select("*")
  .eq("user_id", userId)
  .single();

// Returns:
// {
//   user_id: 1,
//   name: 'John Doe',
//   email: 'john@example.com',
//   wallet_balance: 150.00,
//   total_reservations: 10,
//   active_reservations: 2,
//   total_penalties: 3,
//   unpaid_penalty_amount: 45.00
// }
```

---

## Error Handling

```javascript
const { data, error } = await supabase.from("users").select("*");

if (error) {
  console.error("Error:", error.message);
  // Handle error
} else {
  console.log("Data:", data);
  // Use data
}
```

---

## Advanced Queries

### Filter by Multiple Conditions

```javascript
const { data, error } = await supabase
  .from("reservations")
  .select("*")
  .eq("status", "active")
  .gte("start_time", new Date().toISOString())
  .order("start_time", { ascending: true })
  .limit(10);
```

### Full Text Search

```javascript
const { data, error } = await supabase
  .from("users")
  .select("*")
  .textSearch("name", searchTerm);
```

### Aggregate Functions

```javascript
const { count, error } = await supabase
  .from("reservations")
  .select("*", { count: "exact", head: true })
  .eq("status", "active");
```

---

## Rate Limiting

Supabase has rate limits based on your plan:

- Free tier: 500 requests per second
- Pro tier: 5000 requests per second

Implement exponential backoff for retries:

```javascript
async function fetchWithRetry(fn, retries = 3) {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error.status === 429) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * (4 - retries)));
      return fetchWithRetry(fn, retries - 1);
    }
    throw error;
  }
}
```

---

## Best Practices

1. **Use Indexes**: The schema includes indexes on frequently queried columns
2. **Batch Operations**: Use `.insert([multiple, items])` instead of multiple single inserts
3. **Select Specific Columns**: Use `.select('id, name')` instead of `.select('*')`
4. **Pagination**: Use `.range(start, end)` for large datasets
5. **Real-time Subscriptions**: Unsubscribe when component unmounts
6. **Error Handling**: Always check for errors in responses
7. **Connection Pooling**: Reuse the Supabase client instance
8. **Security**: Never expose your service_role key in client code

---

## Testing

Use Supabase's test database or local development:

```bash
# Start local Supabase
supabase start

# Run migrations
supabase db push

# Seed data
supabase db seed
```

---

For more information, visit [Supabase Documentation](https://supabase.com/docs)
