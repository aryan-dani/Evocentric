import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BatteryCharging,
  Car,
  FileText,
  AlertTriangle,
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    stations: 0,
    parking: 0,
    reservations: 0,
    penalties: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: stations, error: stationsError } = await supabase
        .from("charging_stations")
        .select("*", { count: "exact" });
      const { data: parking, error: parkingError } = await supabase
        .from("parking_lots")
        .select("*", { count: "exact" });
      const { data: reservations, error: reservationsError } = await supabase
        .from("reservations")
        .select("*", { count: "exact" });
      const { data: penalties, error: penaltiesError } = await supabase
        .from("penalties")
        .select("*", { count: "exact" });

      setStats({
        stations: stations?.length || 0,
        parking: parking?.length || 0,
        reservations: reservations?.length || 0,
        penalties: penalties?.length || 0,
      });
    };

    const fetchRecentActivity = async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select("*, users(name)")
        .order("created_at", { ascending: false })
        .limit(5);
      if (data) setRecentActivity(data);
    };

    fetchStats();
    fetchRecentActivity();
  }, []);

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Charging Stations
            </CardTitle>
            <BatteryCharging className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.stations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Parking Lots
            </CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.parking}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Reservations
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reservations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Penalties
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.penalties}</div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardContent>
            <ul>
              {recentActivity.map((activity) => (
                <li
                  key={activity.id}
                  className="flex justify-between py-2 border-b"
                >
                  <span>{activity.users.name} made a reservation.</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(activity.created_at).toLocaleTimeString()}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
