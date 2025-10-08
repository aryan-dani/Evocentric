import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BatteryCharging,
  FileText,
  AlertTriangle,
  TrendingUp,
  Zap,
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    stations: 0,
    reservations: 0,
    penalties: 0,
    users: 0,
    activeReservations: 0,
    totalSlots: 0,
    availableSlots: 0,
    unpaidPenalties: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      // Fetch stations with slot info
      const { data: stations } = await supabase
        .from("charging_stations")
        .select("*");

      // Fetch users count
      const { data: users } = await supabase.from("users").select("*");

      // Fetch reservations
      const { data: reservations } = await supabase
        .from("reservations")
        .select("*");

      // Fetch active reservations
      const { data: activeReservations } = await supabase
        .from("reservations")
        .select("*")
        .eq("status", "active");

      // Fetch penalties
      const { data: penalties } = await supabase.from("penalties").select("*");

      // Fetch unpaid penalties
      const { data: unpaidPenalties } = await supabase
        .from("penalties")
        .select("*")
        .eq("status", "unpaid");

      // Calculate total and available slots
      const totalSlots =
        stations?.reduce(
          (sum, station) => sum + (station.total_slots || 0),
          0
        ) || 0;
      const availableSlots =
        stations?.reduce(
          (sum, station) => sum + (station.available_slots || 0),
          0
        ) || 0;

      setStats({
        stations: stations?.length || 0,
        reservations: reservations?.length || 0,
        penalties: penalties?.length || 0,
        users: users?.length || 0,
        activeReservations: activeReservations?.length || 0,
        totalSlots,
        availableSlots,
        unpaidPenalties: unpaidPenalties?.length || 0,
      });

      setLoading(false);
    };

    const fetchRecentActivity = async () => {
      const { data } = await supabase
        .from("reservations")
        .select("*, users(name)")
        .order("created_at", { ascending: false })
        .limit(5);
      if (data) setRecentActivity(data);
    };

    fetchStats();
    fetchRecentActivity();
  }, []);

  const occupancyRate =
    stats.totalSlots > 0
      ? (
          ((stats.totalSlots - stats.availableSlots) / stats.totalSlots) *
          100
        ).toFixed(1)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to Evocentric - Smart EV Charging & Parking Management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Charging Stations
            </CardTitle>
            <BatteryCharging className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.stations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalSlots} total slots
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Reservations
            </CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeReservations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.reservations} total reservations
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unpaid Penalties
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unpaidPenalties}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.penalties} total penalties
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Occupancy and Performance */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Slot Occupancy Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Occupied</span>
                <span>
                  {stats.totalSlots - stats.availableSlots} / {stats.totalSlots}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${occupancyRate}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Slots
            </CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableSlots}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ready for charging
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-green-50 p-2 rounded">
                <div className="font-semibold text-green-700">Available</div>
                <div className="text-green-600">{stats.availableSlots}</div>
              </div>
              <div className="bg-red-50 p-2 rounded">
                <div className="font-semibold text-red-700">Occupied</div>
                <div className="text-red-600">
                  {stats.totalSlots - stats.availableSlots}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <p className="text-sm text-muted-foreground">
            Latest reservations and system updates
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading activity...
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No recent activity
            </div>
          ) : (
            <ul className="space-y-3">
              {recentActivity.map((activity) => (
                <li
                  key={activity.reservation_id}
                  className="flex items-center justify-between py-3 border-b last:border-0 hover:bg-gray-50 px-2 rounded transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div>
                      <span className="font-medium">
                        {activity.users?.name || "Unknown User"}
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        made a reservation
                      </span>
                      <div className="text-xs text-muted-foreground mt-1">
                        Status:{" "}
                        <span
                          className={`px-2 py-0.5 rounded ${
                            activity.status === "active"
                              ? "bg-green-100 text-green-700"
                              : activity.status === "completed"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(activity.created_at).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
