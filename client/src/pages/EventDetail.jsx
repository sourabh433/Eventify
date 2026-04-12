import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import { sectionCard } from "../utils/ui";
import { FaCalendarAlt, FaMapMarkerAlt, FaChair, FaMoneyBillWave, FaShieldAlt } from "react-icons/fa";
import { EventDetailSkeleton } from "../components/skeletons/Skeletons";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch (err) {
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setBookingLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      if (!showOTP) {
        await api.post("/bookings/send-otp");
        setShowOTP(true);
        setSuccessMsg("OTP sent to your email. Please verify to confirm booking.");
      } else {
        await api.post("/bookings", { eventId: event._id, otp });
        setSuccessMsg("Booking requested! Awaiting admin confirmation.");
        setShowOTP(false);
        setEvent({ ...event, availableSeats: event.availableSeats - 1 });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <EventDetailSkeleton />;
  if (error && !event) return (
    <div className="text-center py-20 text-xl text-red-500 font-medium px-4">{error || "Event not found"}</div>
  );

  const isSoldOut = event.availableSeats <= 0;

  return (
    <div className="w-full max-w-6xl mx-auto my-6 md:my-12 px-2 sm:px-6">
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-slate-100">

        {/* Hero Image Section */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full">
          {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-900 flex items-center justify-center text-white/20 text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter text-center px-4">
              {event.category}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8">
            <span className="bg-blue-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg uppercase tracking-wider shadow-lg">
              {event.category}
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white mt-2 sm:mt-4 drop-shadow-md line-clamp-2">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex flex-col lg:flex-row">

          {/* Main Info Column */}
          <div className="flex-1 p-6 sm:p-8 md:p-12 order-2 lg:order-1 border-t lg:border-t-0 lg:border-r border-slate-100">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2">
              About Event
              <div className="hidden sm:block h-1 w-12 bg-blue-600 rounded-full" />
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed whitespace-pre-line">
              {event.description}
            </p>

            <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
              <FaShieldAlt className="text-blue-600 text-xl sm:text-2xl mt-1 shrink-0" />
              <div>
                <h4 className="font-bold text-blue-900 text-sm sm:text-base">Secure Registration</h4>
                <p className="text-blue-700 text-xs sm:text-sm leading-snug">Every booking requires email verification to ensure a safe community experience for all attendees.</p>
              </div>
            </div>
          </div>

          {/* Sidebar Booking Column */}
          <div className="w-full lg:w-[400px] bg-slate-50/50 p-6 sm:p-8 md:p-12 order-1 lg:order-2">
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-4 sm:top-8">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-6">Event Logistics</h3>

              <div className="space-y-4 sm:space-y-5 mb-8">
                {/* Logistics Item */}
                {[
                  { icon: FaMoneyBillWave, label: "Investment", value: event.ticketPrice === 0 ? "Complimentary" : `₹${event.ticketPrice}`, color: "blue", isPrice: true },
                  { icon: FaChair, label: "Availability", value: `${event.availableSeats} spots left`, sub: `/ ${event.totalSeats} total`, color: "indigo" },
                  { icon: FaCalendarAlt, label: "Date & Time", value: new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), color: "sky" },
                  { icon: FaMapMarkerAlt, label: "Venue", value: event.location, color: "slate", underline: true }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-${item.color}-100 flex items-center justify-center text-${item.color}-600 shrink-0`}>
                      <item.icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                      <p className={`font-bold text-slate-800 text-sm sm:text-base truncate ${item.isPrice && event.ticketPrice === 0 ? 'text-emerald-600' : ''} ${item.underline ? 'underline decoration-blue-200' : ''}`}>
                        {item.value} <span className="text-slate-400 font-medium text-xs">{item.sub || ""}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* OTP Input Section */}
              {showOTP && (
                <div className="mb-6 animate-in fade-in slide-in-from-top-2">
                  <label className="block text-[10px] font-bold text-blue-700 mb-2 uppercase ml-1">Verification Code</label>
                  <input
                    type="text"
                    required
                    placeholder="000000"
                    className="w-full px-2 py-3 sm:py-4 rounded-xl border-2 border-blue-100 focus:border-blue-500 focus:ring-0 transition-all shadow-inner font-mono font-bold tracking-[0.2em] sm:tracking-[0.5em] text-center text-xl sm:text-2xl text-blue-900 bg-blue-50/30"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength="6"
                  />
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={isSoldOut || bookingLoading || (showOTP && !otp)}
                className={`w-full py-3.5 sm:py-4 px-6 rounded-xl font-extrabold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 shadow-lg ${isSoldOut || (successMsg && !showOTP)
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white hover:shadow-blue-200 active:scale-95"
                  }`}
              >
                {bookingLoading ? "Processing..." : showOTP ? "Finalize Booking" : successMsg && !showOTP ? "Request Received" : isSoldOut ? "Sold Out" : "Secure My Seat"}
              </button>

              {/* Status Messages */}
              {error && <p className="text-red-600 mt-4 text-[11px] sm:text-xs text-center font-bold bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}
              {successMsg && <p className="text-emerald-700 mt-4 text-[11px] sm:text-xs text-center font-bold bg-emerald-50 p-3 rounded-lg border border-emerald-100">{successMsg}</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetail;