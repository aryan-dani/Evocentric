import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2, Battery, MapPin } from "lucide-react";

const Stations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [formData, setFormData] = useState({
    station_name: "",
    location: "",
    total_slots: 0,
    available_slots: 0,
  });

  useEffect(() => {
    fetchStations();

    // Real-time subscription
    const channel = supabase
      .channel("stations-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "charging_stations" },
        () => {
          fetchStations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("charging_stations")
      .select("*")
      .order("station_id", { ascending: true });
    if (data) setStations(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingStation) {
      const { error } = await supabase
        .from("charging_stations")
        .update(formData)
        .eq("station_id", editingStation.station_id);
      if (!error) {
        fetchStations();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from("charging_stations")
        .insert([formData]);
      if (!error) {
        fetchStations();
        resetForm();
      }
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this station?")) {
      const { error } = await supabase
        .from("charging_stations")
        .delete()
        .eq("station_id", id);
      if (!error) fetchStations();
    }
  };

  const handleEdit = (station) => {
    setEditingStation(station);
    setFormData({
      station_name: station.station_name,
      location: station.location,
      total_slots: station.total_slots,
      available_slots: station.available_slots,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      station_name: "",
      location: "",
      total_slots: 0,
      available_slots: 0,
    });
    setEditingStation(null);
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Charging Stations</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Station
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Loading...</p>
        ) : stations.length === 0 ? (
          <p>No stations found</p>
        ) : (
          stations.map((station) => (
            <Card
              key={station.station_id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {station.station_name}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin size={14} />
                      {station.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Battery className="text-blue-600" size={20} />
                  <span className="text-sm">
                    <strong>{station.available_slots}</strong> /{" "}
                    {station.total_slots} slots available
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(station)}
                    className="flex-1 text-blue-600 hover:bg-blue-50 py-2 rounded border border-blue-600"
                  >
                    <Edit size={16} className="inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(station.station_id)}
                    className="flex-1 text-red-600 hover:bg-red-50 py-2 rounded border border-red-600"
                  >
                    <Trash2 size={16} className="inline mr-1" />
                    Delete
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingStation ? "Edit Station" : "Add New Station"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Station Name
                </label>
                <input
                  type="text"
                  value={formData.station_name}
                  onChange={(e) =>
                    setFormData({ ...formData, station_name: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Total Slots
                </label>
                <input
                  type="number"
                  value={formData.total_slots}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      total_slots: parseInt(e.target.value),
                    })
                  }
                  className="w-full border rounded-md px-3 py-2"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Available Slots
                </label>
                <input
                  type="number"
                  value={formData.available_slots}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      available_slots: parseInt(e.target.value),
                    })
                  }
                  className="w-full border rounded-md px-3 py-2"
                  required
                  min="0"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingStation ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stations;
