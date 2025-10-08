import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2, Car, MapPin } from "lucide-react";

const Parking = () => {
  const [parkingLots, setParkingLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLot, setEditingLot] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    total_spaces: 0,
    available_spaces: 0,
    hourly_rate: 0,
  });

  useEffect(() => {
    fetchParkingLots();

    // Real-time subscription
    const channel = supabase
      .channel("parking-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "parking_lots" },
        () => {
          fetchParkingLots();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchParkingLots = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("parking_lots")
      .select("*")
      .order("id", { ascending: true });
    if (data) setParkingLots(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingLot) {
      const { error } = await supabase
        .from("parking_lots")
        .update(formData)
        .eq("id", editingLot.id);
      if (!error) {
        fetchParkingLots();
        resetForm();
      }
    } else {
      const { error } = await supabase.from("parking_lots").insert([formData]);
      if (!error) {
        fetchParkingLots();
        resetForm();
      }
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this parking lot?")) {
      const { error } = await supabase
        .from("parking_lots")
        .delete()
        .eq("id", id);
      if (!error) fetchParkingLots();
    }
  };

  const handleEdit = (lot) => {
    setEditingLot(lot);
    setFormData({
      name: lot.name,
      location: lot.location,
      total_spaces: lot.total_spaces,
      available_spaces: lot.available_spaces,
      hourly_rate: lot.hourly_rate,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      total_spaces: 0,
      available_spaces: 0,
      hourly_rate: 0,
    });
    setEditingLot(null);
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Parking Lots</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Parking Lot
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Loading...</p>
        ) : parkingLots.length === 0 ? (
          <p>No parking lots found</p>
        ) : (
          parkingLots.map((lot) => (
            <Card key={lot.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{lot.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin size={14} />
                      {lot.location}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    ${lot.hourly_rate}/hr
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Car className="text-blue-600" size={20} />
                  <span className="text-sm">
                    <strong>{lot.available_spaces}</strong> / {lot.total_spaces}{" "}
                    spaces available
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (lot.available_spaces / lot.total_spaces) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(lot)}
                    className="flex-1 text-blue-600 hover:bg-blue-50 py-2 rounded border border-blue-600"
                  >
                    <Edit size={16} className="inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(lot.id)}
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
              {editingLot ? "Edit Parking Lot" : "Add New Parking Lot"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Lot Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
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
                  Total Spaces
                </label>
                <input
                  type="number"
                  value={formData.total_spaces}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      total_spaces: parseInt(e.target.value),
                    })
                  }
                  className="w-full border rounded-md px-3 py-2"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Available Spaces
                </label>
                <input
                  type="number"
                  value={formData.available_spaces}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      available_spaces: parseInt(e.target.value),
                    })
                  }
                  className="w-full border rounded-md px-3 py-2"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Hourly Rate ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.hourly_rate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hourly_rate: parseFloat(e.target.value),
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
                  {editingLot ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parking;
