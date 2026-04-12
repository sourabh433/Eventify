import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaTimesCircle, FaCalendarDay, FaCoins, FaInfoCircle, FaChevronRight } from 'react-icons/fa';
import { card } from "../utils/ui";
import { UserDashboardSkeleton } from "../components/skeletons/Skeletons";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      const { data } = await api.get('/bookings/my');
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [user, navigate, fetchBookings]);

  const cancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking request?')) {
      try {
        await api.delete(`/bookings/${id}`);
        fetchBookings();
      } catch (error) {
        alert(error.response?.data?.message || 'Error cancelling booking');
      }
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-600 text-white border-blue-600';
      case 'cancelled': return 'bg-slate-100 text-slate-500 border-slate-200';
      default: return 'bg-sky-100 text-sky-700 border-sky-200';
    }
  };

  if (loading) return <UserDashboardSkeleton />;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Modern Blue Gradient Header */}
        <header className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 rounded-3xl shadow-xl shadow-blue-200/50 p-6 md:p-10 mb-10 border border-blue-400/20">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-2xl flex items-center justify-center text-3xl md:text-5xl font-black shadow-inner shrink-0">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-grow text-center md:text-left text-white">
              <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight">
                Hello, {user?.name.split(' ')[0]}!
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs md:text-sm font-bold border border-white/20 uppercase tracking-widest">
                  Verified Member
                </span>
                <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse"></span>
                <span className="text-blue-100 text-xs md:text-sm font-medium">Manage your event passes</span>
              </div>
            </div>
          </div>
        </header>

        {/* Section Heading */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-3xl font-black text-slate-700 flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-200">
              <FaTicketAlt className="text-white text-sm md:text-xl" />
            </div>
            Your Reservations
            <span className="bg-slate-200 text-slate-600 text-sm font-bold px-3 py-1 rounded-full ml-2">
              {bookings.length}
            </span>
          </h2>
        </div>

        {/* Content Area */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 md:p-20 text-center border-2 border-dashed border-blue-100 shadow-sm">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <FaTicketAlt className="text-blue-200 text-4xl md:text-6xl" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">No active bookings</h3>
            <p className="text-slate-500 mb-10 max-w-sm mx-auto leading-relaxed">
              You haven't booked any events yet. Start exploring the latest happenings around you!
            </p>
            <Link to="/" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-10 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-200">
              Browse Events <FaChevronRight className="text-xs" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {bookings.map((booking) => (
              <div key={booking._id} className={card("group bg-white border border-slate-100 rounded-[2rem] transition-all duration-300 hover:shadow-2xl hover:shadow-blue-100 hover:-translate-y-1 overflow-hidden flex flex-col")}>
                
                {/* Card Top Section */}
                <div className="p-6 md:p-8 flex-grow">
                  {booking.eventId ? (
                    <>
                      <div className="flex justify-between items-start gap-4 mb-6">
                        <h3 className="text-xl md:text-2xl font-extrabold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                          {booking.eventId.title}
                        </h3>
                        <span className={`px-3 py-1 text-[10px] font-black rounded-full border-2 uppercase tracking-tighter shrink-0 ${getStatusStyles(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                            <FaCalendarDay />
                          </div>
                          <span>{new Date(booking.eventId.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
                          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-500">
                            <FaCoins />
                          </div>
                          <span className={booking.amount === 0 ? 'text-green-600' : 'text-slate-900 font-black'}>
                            {booking.amount === 0 ? 'Free Event' : `₹${booking.amount}`}
                          </span>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-50 flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                          <FaInfoCircle />
                          <span>Reserved on {new Date(booking.bookedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-10 text-center bg-slate-50 rounded-2xl">
                      <p className="text-slate-400 text-sm font-bold italic">Details Unavailable</p>
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="px-6 py-5 md:px-8 bg-blue-50/50 flex justify-between items-center border-t border-slate-100">
                  {booking.eventId && booking.status !== 'cancelled' ? (
                    <>
                      <Link to={`/events/${booking.eventId._id}`} className="text-blue-700 font-black text-sm hover:text-blue-900 flex items-center gap-1 group/link">
                        View Details <FaChevronRight className="text-[10px] transition-transform group-hover/link:translate-x-1" />
                      </Link>
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        className="text-slate-400 hover:text-red-600 font-bold text-sm transition-colors flex items-center gap-2"
                      >
                        <FaTimesCircle /> Cancel
                      </button>
                    </>
                  ) : (
                    <div className="w-full text-center text-xs font-black text-slate-400 uppercase tracking-widest">
                      Reservation Inactive
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;