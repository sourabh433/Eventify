import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserDashboardSkeleton } from "../components/skeletons/Skeletons";

const AdminDashboard = () => {
  const API = import.meta.env.VITE_API_URL;
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    totalSeats: "",
    ticketPrice: "",
    imageUrl: "",
  });

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const stats = {
    totalEvents: events.length,
    pendingBookings: bookings.filter((b) => b.status === "pending").length,
    confirmedBookings: bookings.filter((b) => b.status === "confirmed").length,
    cancelledBookings: bookings.filter((b) => b.status === "cancelled").length,
    totalRevenue: bookings
      .filter((b) => b.status === "confirmed")
      .reduce((acc, curr) => acc + (curr.eventId?.ticketPrice || 0), 0),
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingRes, eventRes] = await Promise.all([
        axios.get(`${API}/api/bookings`, config),
        axios.get(`${API}/api/events`),
      ]);
      setBookings(bookingRes.data);
      setEvents(eventRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Data Fetch Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      if (editingEvent) {
        await axios.put(
          `${API}/api/events/${editingEvent}`,
          formData,
          config
        );
      } else {
        await axios.post(`${API}/api/events`, formData, config);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Operation failed");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
      handleFormSubmit(e);
    }
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      description: "",
      date: "",
      location: "",
      category: "",
      totalSeats: "",
      ticketPrice: "",
      imageUrl: "",
    });
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event._id);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split("T")[0],
      location: event.location,
      category: event.category,
      totalSeats: event.totalSeats,
      ticketPrice: event.ticketPrice,
      imageUrl: event.imageUrl,
    });
    setShowModal(true);
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API}/api/events/${id}`, config);
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleConfirm = async (id) => {
    try {
      await axios.put(
        `${API}/api/bookings/${id}/confirm`,
        { paymentStatus: "paid" },
        config
      );
      fetchData();
    } catch (err) {
      alert("Confirmation failed");
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Remove this booking?")) return;
    try {
      await axios.delete(`${API}/api/bookings/${id}`, config);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-3 sm:p-6 md:p-8">
        <UserDashboardSkeleton />
      </div>
    );
  }

  const filteredBookings = bookings.filter((b) => b.status === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-6 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 rounded-3xl shadow-xl shadow-blue-200/50 p-6 md:p-10 mb-10 border border-blue-400/20">

        {/* Decorative blur effects */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 text-white">

          {/* Left Content */}
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
              Admin Control Panel
            </h1>
            <p className="text-blue-100 font-medium text-sm mt-1">
              Real-time platform analytics
            </p>

            {/* Status badge */}
            <div className="flex items-center gap-3 mt-3">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold border border-white/20 uppercase tracking-widest">
                Admin Access
              </span>
              <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse"></span>
              <span className="text-blue-100 text-xs font-medium">
                Manage events & bookings
              </span>
            </div>
          </div>

          {/* Right Button */}
          {activeTab === "events" && (
            <button
              onClick={openCreateModal}
              className="w-full sm:w-auto bg-white text-blue-700 px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition"
            >
              + Create Event
            </button>
          )}

        </div>
      </header>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {[
          { label: "Events", val: stats.totalEvents, color: "text-blue-600" },
          {
            label: "Revenue",
            val: `₹${stats.totalRevenue}`,
            color: "text-emerald-600",
          },
          {
            label: "Pending",
            val: stats.pendingBookings,
            color: "text-amber-500",
          },
          {
            label: "Confirmed",
            val: stats.confirmedBookings,
            color: "text-green-500",
          },
          {
            label: "Cancelled",
            val: stats.cancelledBookings,
            color: "text-red-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"
          >
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">
              {stat.label}
            </p>
            <h2 className={`text-xl sm:text-2xl font-black ${stat.color}`}>
              {stat.val}
            </h2>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-6 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {["pending", "confirmed", "cancelled", "events"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-bold capitalize whitespace-nowrap text-sm transition-all ${activeTab === tab
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-500 border"
              }`}
          >
            {tab}

            <span className="ml-1 opacity-60">
              (
              {tab === "events"
                ? events?.length || 0   // ✅ direct safe value
                : stats?.[`${tab}Bookings`] || 0}
              )
            </span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === "events" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-xl overflow-hidden border shadow-sm"
              >
                <img
                  src={event.imageUrl}
                  className="h-40 w-full object-cover"
                  alt=""
                />
                <div className="p-4">
                  <h3 className="font-bold text-blue-900 truncate">
                    {event.title}
                  </h3>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => openEditModal(event)}
                      className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-xs font-bold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="flex-1 bg-red-50 text-red-500 py-2 rounded-lg text-xs font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* MOBILE VIEW */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <div key={booking._id} className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-slate-800">
                          {booking.userId?.name || "Unknown User"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {booking.eventId?.title}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${activeTab === "confirmed"
                          ? "bg-green-100 text-green-600"
                          : activeTab === "cancelled"
                            ? "bg-red-100 text-red-600"
                            : "bg-amber-100 text-amber-600"
                          }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {activeTab === "pending" && (
                        <button
                          onClick={() => handleConfirm(booking._id)}
                          className="flex-1 bg-green-500 text-white py-2 rounded-lg text-xs font-bold"
                        >
                          Confirm
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteBooking(booking._id)}
                        className="flex-1 border py-2 rounded-lg text-xs font-bold text-slate-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-10 text-center text-slate-400">
                  No {activeTab} bookings found.
                </p>
              )}
            </div>

            {/* DESKTOP VIEW */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-xs uppercase border-b">
                  <tr>
                    <th className="p-5">User</th>
                    <th className="p-5">Event</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-slate-50">
                      <td className="p-5">
                        <div className="font-bold text-slate-800">
                          {booking.userId?.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {booking.userId?.email}
                        </div>
                      </td>
                      <td className="p-5 text-slate-600">
                        {booking.eventId?.title}
                      </td>
                      <td className="p-5">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-slate-100">
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-5 text-right space-x-2">
                        {activeTab === "pending" && (
                          <button
                            onClick={() => handleConfirm(booking._id)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg text-xs font-bold"
                          >
                            Confirm
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteBooking(booking._id)}
                          className="border px-4 py-2 rounded-lg text-xs font-bold text-slate-400"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 p-4 text-white flex justify-between sticky top-0 z-10">
              <h2 className="font-bold">
                {editingEvent ? "Edit Event" : "Create Event"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl"
              >
                &times;
              </button>
            </div>
            <form
              onKeyDown={handleKeyDown}
              onSubmit={handleFormSubmit}
              className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <input
                type="text"
                placeholder="Title"
                className="p-3 border rounded-xl"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Category"
                className="p-3 border rounded-xl"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              />
              <input
                type="date"
                className="p-3 border rounded-xl"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Location"
                className="p-3 border rounded-xl"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Seats"
                className="p-3 border rounded-xl"
                value={formData.totalSeats}
                onChange={(e) =>
                  setFormData({ ...formData, totalSeats: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Price"
                className="p-3 border rounded-xl"
                value={formData.ticketPrice}
                onChange={(e) =>
                  setFormData({ ...formData, ticketPrice: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Image URL"
                className="p-3 border rounded-xl sm:col-span-2"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                required
              />
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="sm:col-span-2 h-40 w-full object-cover rounded-xl border"
                />
              )}
              <textarea
                placeholder="Description"
                className="p-3 border rounded-xl sm:col-span-2 h-24"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
              <button
                type="submit"
                className="sm:col-span-2 bg-blue-600 text-white py-3 rounded-xl font-bold"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;