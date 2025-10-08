import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2, Search } from "lucide-react";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    user_id: "",
    station_id: "",
    slot_number: "",
    start_time: "",
    end_time: "",
    status: "active",
    payment_status: "pending",
  });

  useEffect(() => {
    fetchReservations();
    fetchUsers();
    fetchStations();

    // Real-time subscription
    const channel = supabase
      .channel("reservations-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reservations" },
        () => {
          fetchReservations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reservations")
      .select("*, users(name), charging_stations(name)")
      .order("id", { ascending: false });
    if (data) setReservations(data);
    setLoading(false);
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from("users").select("id, name");
    if (data) setUsers(data);
  };

  const fetchStations = async () => {
    const { data } = await supabase
      .from("charging_stations")
      .select("id, name");
    if (data) setStations(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingReservation) {
      const { error } = await supabase
        .from("reservations")
        .update(formData)
        .eq("id", editingReservation.id);
      if (!error) {
        fetchReservations();
        resetForm();
      }
    } else {
      const { error } = await supabase.from("reservations").insert([formData]);
      if (!error) {
        fetchReservations();
        resetForm();
      }
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this reservation?")) {
      const { error } = await supabase
        .from("reservations")
        .delete()
        .eq("id", id);
      if (!error) fetchReservations();
    }
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setFormData({
      user_id: reservation.user_id,
      station_id: reservation.station_id,
      slot_number: reservation.slot_number,
      start_time: reservation.start_time,
      end_time: reservation.end_time,
      status: reservation.status,
      payment_status: reservation.payment_status,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      user_id: "",
      station_id: "",
      slot_number: "",
      start_time: "",
      end_time: "",
      status: "active",
      payment_status: "pending",
    });
    setEditingReservation(null);
    setShowModal(false);
  };

  const filteredReservations = reservations.filter(
    (res) =>
      res.users?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.charging_stations?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      res.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reservations Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Reservation
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by user, station, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Station
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Slot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Start Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    End Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : filteredReservations.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-4 text-center">
                      No reservations found
                    </td>
                  </tr>
                ) : (
                  filteredReservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">{reservation.id}</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {reservation.users?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {reservation.charging_stations?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {reservation.slot_number}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(reservation.start_time).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(reservation.end_time).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            reservation.status === "active"
                              ? "bg-green-100 text-green-800"
                              : reservation.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {reservation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            reservation.payment_status === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {reservation.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(reservation)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(reservation.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingReservation ? "Edit Reservation" : "Add New Reservation"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">User</label>
                <select
                  value={formData.user_id}
                  onChange={(e) =>
                    setFormData({ ...formData, user_id: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2"
                  required
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Station
                </label>
                <select
                  value={formData.station_id}
                  onChange={(e) =>
                    setFormData({ ...formData, station_id: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2"
                  required
                >
                  <option value="">Select Station</option>
                  {stations.map((station) => (
                    <option key={station.id} value={station.id}>
                      {station.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Slot Number
                </label>
                <input
                  type="text"
                  value={formData.slot_number}
                  onChange={(e) =>
                    setFormData({ ...formData, slot_number: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) =>
                    setFormData({ ...formData, start_time: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) =>
                    setFormData({ ...formData, end_time: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Payment Status
                </label>
                <select
                  value={formData.payment_status}
                  onChange={(e) =>
                    setFormData({ ...formData, payment_status: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
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
                  {editingReservation ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations;
