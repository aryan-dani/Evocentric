import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Edit,
  Trash2,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";

const Penalties = () => {
  const [penalties, setPenalties] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPenalty, setEditingPenalty] = useState(null);
  const [formData, setFormData] = useState({
    reservation_id: "",
    reason: "",
    amount: 0,
    status: "unpaid",
  });

  useEffect(() => {
    fetchPenalties();
    fetchReservations();

    // Real-time subscription
    const channel = supabase
      .channel("penalties-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "penalties" },
        () => {
          fetchPenalties();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPenalties = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("penalties")
      .select("*, reservations(reservation_id, user_id, users(name))")
      .order("created_at", { ascending: false });
    if (data) setPenalties(data);
    setLoading(false);
  };

  const fetchReservations = async () => {
    const { data } = await supabase
      .from("reservations")
      .select("reservation_id, user_id, users(name)");
    if (data) setReservations(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingPenalty) {
      const { error } = await supabase
        .from("penalties")
        .update(formData)
        .eq("penalty_id", editingPenalty.penalty_id);
      if (!error) {
        fetchPenalties();
        resetForm();
      }
    } else {
      const { error } = await supabase.from("penalties").insert([formData]);
      if (!error) {
        fetchPenalties();
        resetForm();
      }
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this penalty?")) {
      const { error } = await supabase
        .from("penalties")
        .delete()
        .eq("penalty_id", id);
      if (!error) fetchPenalties();
    }
  };

  const handleEdit = (penalty) => {
    setEditingPenalty(penalty);
    setFormData({
      reservation_id: penalty.reservation_id,
      reason: penalty.reason,
      amount: penalty.amount,
      status: penalty.status,
    });
    setShowModal(true);
  };

  const togglePenaltyStatus = async (penalty) => {
    const newStatus = penalty.status === "paid" ? "unpaid" : "paid";
    const { error } = await supabase
      .from("penalties")
      .update({ status: newStatus })
      .eq("penalty_id", penalty.penalty_id);
    if (!error) fetchPenalties();
  };

  const resetForm = () => {
    setFormData({
      reservation_id: "",
      reason: "",
      amount: 0,
      status: "unpaid",
    });
    setEditingPenalty(null);
    setShowModal(false);
  };

  const totalPenalties = penalties.reduce(
    (sum, p) => sum + parseFloat(p.amount || 0),
    0
  );
  const paidPenalties = penalties
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  const unpaidPenalties = penalties
    .filter((p) => p.status === "unpaid")
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Penalty Tracking</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Penalty
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Penalties</p>
                <p className="text-2xl font-bold">
                  ${totalPenalties.toFixed(2)}
                </p>
              </div>
              <DollarSign className="text-gray-400" size={32} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  ${paidPenalties.toFixed(2)}
                </p>
              </div>
              <CheckCircle className="text-green-400" size={32} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Unpaid</p>
                <p className="text-2xl font-bold text-red-600">
                  ${unpaidPenalties.toFixed(2)}
                </p>
              </div>
              <XCircle className="text-red-400" size={32} />
            </div>
          </CardContent>
        </Card>
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
                    Reservation ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : penalties.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      No penalties found
                    </td>
                  </tr>
                ) : (
                  penalties.map((penalty) => (
                    <tr key={penalty.penalty_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        {penalty.penalty_id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {penalty.reservations?.users?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {penalty.reservation_id}
                      </td>
                      <td className="px-6 py-4 text-sm">{penalty.reason}</td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        ${parseFloat(penalty.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => togglePenaltyStatus(penalty)}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            penalty.status === "paid"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {penalty.status === "paid" ? "Paid" : "Unpaid"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(penalty.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(penalty)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(penalty.penalty_id)}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingPenalty ? "Edit Penalty" : "Add New Penalty"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Reservation
                </label>
                <select
                  value={formData.reservation_id}
                  onChange={(e) =>
                    setFormData({ ...formData, reservation_id: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2"
                  required
                >
                  <option value="">Select Reservation</option>
                  {reservations.map((reservation) => (
                    <option
                      key={reservation.reservation_id}
                      value={reservation.reservation_id}
                    >
                      #{reservation.reservation_id} -{" "}
                      {reservation.users?.name || "Unknown User"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2"
                  required
                  rows="3"
                  placeholder="e.g., Overstay penalty, Late cancellation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: parseFloat(e.target.value),
                    })
                  }
                  className="w-full border rounded-md px-3 py-2"
                  required
                  min="0"
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
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
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
                  {editingPenalty ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Penalties;
