import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { card, sectionCard, button } from "../utils/ui";

const AdminDashboard = () => {

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showEventForm, setShowEventForm] = useState(false);
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



  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        api.get("/events"),
        api.get("/bookings"), // Admin gets all bookings
      ]);
      setEvents(eventsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error("Error fetching admin data", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED CREATE EVENT
  const handleCreateEvent = async (e) => {
    e.preventDefault();

    try {
      await api.post("/events", {
        ...formData,
        totalSeats: Number(formData.totalSeats),
        ticketPrice: Number(formData.ticketPrice),
      });

      setShowEventForm(false);

      // ✅ RESET FIXED
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

      fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Error creating event");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/events/${id}`);

        fetchData();
      } catch (error) {
        alert("Error deleting event");
      }
    }
  };

  const handleConfirmBooking = async (id, paymentStatus) => {
    try {
      await api.put(`/bookings/${id}/confirm`, { paymentStatus });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Error confirming booking");
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm("Cancel this user's booking request?")) {
      try {
        await api.delete(`/bookings/${id}`);
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || "Error cancelling booking");
      }
    }
  };

  const StatsSkeleton = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-gray-200 rounded-2xl"
          ></div>
        ))}
      </div>
    );


    const SkeletonCard = () => {
      return (
        <div className="bg-white p-4 rounded-xl shadow-sm border animate-pulse">
          <div className="w-full h-32 bg-gray-200 rounded-lg mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      );
    };
  };

  if (loading)
    return (
      <div className="max-w-7xl mx-auto p-6">

        {/* Title skeleton */}
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6 animate-pulse"></div>

        {/* Stats */}
        <StatsSkeleton />

        {/* Event skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-40 bg-gray-200 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );




  const pendingBookings = bookings.filter(b => b.status === "pending");
  const confirmedBookings = bookings.filter(b => b.status === "confirmed");
  const cancelledBookings = bookings.filter(b => b.status === "cancelled");



  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-black text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-lg flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-300">
            Manage events and manually confirm bookings.
          </p>
        </div>
        <button
          onClick={() => setShowEventForm(!showEventForm)}
          className="w-full md:w-auto bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition shadow-md"
        >
          {showEventForm ? "Cancel Creation" : "+ Create New Event"}
        </button>
      </div>

      {/* Admin Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between bg-gradient-to-r from-green-200 to-gray-200">
          <div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">
              Total Revenue
            </p>
            <h3 className="text-3xl font-black text-green-600">
              ₹
              {bookings.reduce(
                (sum, b) =>
                  b.paymentStatus === "paid" && b.status === "confirmed"
                    ? sum + b.amount
                    : sum,
                0,
              )}
            </h3>
          </div>
          <div className="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-xl font-bold">
            ₹
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-200 to-green-200">
          <div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">
              Paid Clients
            </p>
            <h3 className="text-3xl font-black text-blue-500">
              {
                new Set(
                  bookings
                    .filter(
                      (b) =>
                        b.paymentStatus === "paid" && b.status === "confirmed",
                    )
                    .map((b) => b.userId?._id),
                ).size
              }
            </h3>
          </div>
          <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-xl font-bold">
            👤
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between bg-gradient-to-r from-yellow-100 to-gray-200">
          <div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">
              Pending Requests
            </p>
            <h3 className="text-3xl font-black text-yellow-600">
              {bookings.filter((b) => b.status === "pending").length}
            </h3>
          </div>
          <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xl font-bold">
            ⏳
          </div>
        </div>
      </div>

      {showEventForm && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 animation-slideDown">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Create New Event
          </h2>
          <form
            onSubmit={handleCreateEvent}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <input
              required
              type="text"
              placeholder="Event Title"
              className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <input
              required
              type="text"
              placeholder="Category (e.g., Tech, Music)"
              className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
            <input
              required
              type="date"
              className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
            <input
              required
              type="text"
              placeholder="Location"
              className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
            <input
              required
              type="number"
              placeholder="Total Seats"
              className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition"
              value={formData.totalSeats}
              onChange={(e) =>
                setFormData({ ...formData, totalSeats: e.target.value })
              }
            />
            <input
              required
              type="number"
              placeholder="Ticket Price (0 for free)"
              className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition"
              value={formData.ticketPrice}
              onChange={(e) =>
                setFormData({ ...formData, ticketPrice: e.target.value })
              }
            />

            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Image URL (Provide any direct link to an image)"
                className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
              />
            </div>

            <textarea
              required
              placeholder="Event Description"
              className="border px-4 py-3 rounded-lg md:col-span-2 h-32 focus:ring-2 focus:ring-gray-700 outline-none transition"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <button
              type="submit"
              className="md:col-span-2 bg-gray-900 text-white font-bold py-3 mt-2 rounded-lg hover:bg-black transition shadow-md"
            >
              Publish Event
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Events Section */}
        <div className="flex flex-col">

          <div className="flex items-center justify-between rounded-2xl px-5 py-4 shadow-sm border bg-gradient-to-r from-blue-200 to-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              All Events
            </h2>

            <span className="bg-white border text-gray-700 px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
              {events.length}
            </span>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
              {events.length === 0 ? (
                <li className="p-6 text-gray-500 text-center">
                  No events created yet.
                </li>
              ) : (
                events.map((event) => (
                  <li
                    key={event._id}
                    className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 transition border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1 leading-tight">
                        {event.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1 font-medium">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>{" "}
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <div
                            className={`w-2 h-2 rounded-full ${event.availableSeats > 0 ? "bg-green-500" : "bg-red-500"}`}
                          ></div>{" "}
                          {event.availableSeats}/{event.totalSeats} seats
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                     className={button("danger")}
                    >
                      Delete
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Cancelled */}
          <div className="mt-6">
            <div className="flex items-center justify-between rounded-2xl px-5 py-4 shadow-sm border bg-gradient-to-r from-red-100 to-gray-200">
              <h2 className="text-lg font-semibold text-red-600">
                ❌ Rejected Bookings
              </h2>
              <div className="mt-4"></div>

              <span className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold">
                {cancelledBookings.length}
              </span>
            </div>

            <div className="bg-white rounded-xl shadow-sm border max-h-[400px] overflow-y-auto">
              {cancelledBookings.length === 0 ? (
                <p className="p-4 text-gray-500 text-center">No rejected bookings</p>
              ) : (
                cancelledBookings.map((booking) => (
                  <div key={booking._id} className="p-4 border-b last:border-0">
                    <p className="font-bold">{booking.eventId?.title}</p>
                    <p className="text-sm text-gray-600">
                      {booking.userId?.name}
                    </p>
                    <p className="text-sm text-red-500  font-semibold">
                      Rejected
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        {/* Bookings Section */}
        <div className="flex flex-col gap-6">

          {/* Pending */}
          <div className="">
            <div className="flex items-center justify-between rounded-2xl px-5 py-4 shadow-sm border bg-gradient-to-r from-yellow-100 to-gray-200">
              <h2 className="text-lg font-semibold text-amber-600">
                ⏳ Pending Requests
              </h2>
              <div className="mt-4"></div>

              <span className="text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-semibold">
                {pendingBookings.length}
              </span>
            </div>

            <div className="bg-white rounded-xl shadow-sm border max-h-[400px] overflow-y-auto">
              {pendingBookings.length === 0 ? (
                <p className="p-4 text-gray-500 text-center">No pending bookings</p>
              ) : (
                pendingBookings.map((booking) => (
                  <div key={booking._id} className="p-4 border-b last:border-0">
                    <p className="font-bold">{booking.eventId?.title}</p>
                    <p className="text-sm text-gray-600">
                      {booking.userId?.name} ({booking.userId?.email})
                    </p>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleConfirmBooking(booking._id, "paid")}
                       className={button("success")}
                      >
                        Approve Paid
                      </button>
                      <button
                        onClick={() => handleConfirmBooking(booking._id, "not_paid")}
                        className={button("success")}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                       className={button("danger")}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Confirmed Bookings Section */}
          <div>
            <div className="flex items-center justify-between rounded-2xl px-5 py-4 shadow-sm border bg-gradient-to-r from-green-100 to-gray-200" >
              <h2 className="text-lg font-semibold text-emerald-700">
                ✅ Confirmed Bookings
              </h2>
              <div className="mt-4"></div>

              <span className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold">
                {confirmedBookings.length}
              </span>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {confirmedBookings.length === 0 && (
                <p className="text-gray-500 text-sm">No confirmed bookings</p>
              )}

              {confirmedBookings.map((booking) => (
               <div
  key={booking._id}
  className={card()}
>
                  <p className="font-semibold">{booking.eventId?.title}</p>
                  <p className="text-sm text-gray-500">
                    {booking.userId?.name}
                  </p>

                  {/* LEFT: Paid | RIGHT: Delete */}
                  <div className="flex justify-between items-center mt-3">
                    <span
                      className={`text-sm font-semibold ${booking.paymentStatus === "paid"
                        ? "text-green-600"
                        : "text-gray-500"
                        }`}
                    >
                      {booking.paymentStatus === "paid" ? "💰 Paid" : "Unpaid"}
                    </span>

                    <button
                      className="text-red-500 hover:text-red-700 text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>



        </div>
      </div>
    </div>
  );
};


export default AdminDashboard;
