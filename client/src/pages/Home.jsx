import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt, FaMapMarkerAlt, FaSearch,
  FaFilter, FaRegClock, FaTicketAlt, FaShieldAlt
} from "react-icons/fa";
import api from "../utils/axios";
import { sectionCard } from "../utils/ui";
import { EventCardSkeleton } from "../components/skeletons/Skeletons";

const INITIAL_FILTERS = { category: "Genre", location: "City", price: 5000, sort: "" };

const Home = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [tempFilters, setTempFilters] = useState(INITIAL_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/events");
        setAllEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="bg-yellow-200 font-semibold">{part}</span>
      ) : part
    );
  };

  const filteredEvents = useMemo(() => {
    return allEvents
      .filter((event) => {
        const searchTerms = debouncedQuery.toLowerCase().split(" ").filter(Boolean);
        const matchesSearch = searchTerms.length === 0 || searchTerms.every(word =>
          event.title?.toLowerCase().includes(word) ||
          event.category?.toLowerCase().includes(word) ||
          event.location?.toLowerCase().includes(word)
        );
        const matchesCategory = filters.category === "Genre" || event.category === filters.category;
        const matchesLocation = filters.location === "City" || event.location === filters.location;
        const matchesPrice = event.ticketPrice <= filters.price;
        return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
      })
      .sort((a, b) => {
        if (filters.sort === "priceLow") return a.ticketPrice - b.ticketPrice;
        if (filters.sort === "priceHigh") return b.ticketPrice - a.ticketPrice;
        if (filters.sort === "newest") return new Date(b.date) - new Date(a.date);
        return 0;
      });
  }, [allEvents, debouncedQuery, filters]);

  const suggestions = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase();
    return allEvents.filter(event =>
      event.title?.toLowerCase().includes(q) ||
      event.category?.toLowerCase().includes(q) ||
      event.location?.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [allEvents, debouncedQuery]);

  const categories = ["Genre", ...new Set(allEvents.map(e => e.category))];
  const locations = ["City", ...new Set(allEvents.map(e => e.location))];

  return (
    <div className="flex flex-col min-h-screen px-4 md:px-8">
      <div className="relative bg-black text-white rounded-3xl mb-12 shadow-2xl overflow-visible mt-6">
        <div className="absolute inset-0 rounded-3xl opacity-40 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent rounded-3xl" />
        <div className="relative p-10 md:p-20 text-center flex flex-col items-center z-10">
          <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">Welcome to Eventify</span>
          <h1 className="text-3xl sm:text-4xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
            Find Your Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">Unforgettable</span> Experience
          </h1>
          <div className="w-full max-w-2xl relative z-50">
            <div className="relative group">
              <button onClick={() => { setTempFilters(filters); setShowFilters(true); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"><FaFilter /></button>
              <input ref={inputRef} type="text" placeholder="Search events, cities, or categories..." value={query} onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }} className="w-full pl-12 pr-12 py-4 rounded-full text-black shadow-xl focus:ring-4 focus:ring-white/20 outline-none transition-all" />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"><FaSearch /></div>
              {showSuggestions && suggestions.length > 0 && (
                <div ref={dropdownRef} className="absolute left-0 top-full mt-3 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-72 overflow-y-auto z-50 overflow-hidden">
                  {suggestions.map((event, i) => (
                    <div key={i} onClick={() => { setQuery(event.title); setShowSuggestions(false); }} className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 border-b last:border-none transition-colors">
                      <div className="bg-gray-100 p-2 rounded-lg text-gray-600"><FaSearch size={12} /></div>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-bold text-gray-900">{highlightText(event.title, debouncedQuery)}</span>
                        <span className="text-xs text-gray-500">{event.category} • {event.location}</span>
                      </div>
                      <div className="ml-auto text-sm font-semibold text-gray-900">₹{event.ticketPrice}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          { icon: <FaRegClock />, title: "Fast Booking", desc: "Secure tickets instantly with our streamlined infrastructure." },
          { icon: <FaTicketAlt />, title: "Seamless Access", desc: "Manage and download tickets directly from your dashboard." },
          { icon: <FaShieldAlt />, title: "Secure Platform", desc: "Transactions protected by cutting-edge encryption." }
        ].map((feature, idx) => (
          <div key={idx} className={sectionCard("flex flex-col items-center text-center p-8")}>
            <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center text-xl mb-6 shadow-lg">{feature.icon}</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-500 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900">Upcoming Events</h2>
        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">{filteredEvents.length} Results</div>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => <EventCardSkeleton key={i} />)}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 text-gray-400 font-medium">No events found matching your criteria.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredEvents.map((event) => (
            <div key={event._id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                {event.imageUrl ? <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-semibold">{event.category}</div>}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-70" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold shadow">{event.ticketPrice === 0 ? <span className="text-green-600">Free</span> : `₹${event.ticketPrice}`}</div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">{event.category}</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-1">{event.title}</h3>
                <div className="space-y-2 text-sm text-gray-500 mb-5">
                  <div className="flex items-center gap-2"><FaCalendarAlt className="text-gray-400 text-xs" />{new Date(event.date).toLocaleDateString()}</div>
                  <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-gray-400 text-xs" />{event.location}</div>
                </div>
                <div className="mt-auto">
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2 overflow-hidden">
                    <div className="bg-gray-900 h-full rounded-full transition-all duration-500" style={{ width: `${(event.availableSeats / event.totalSeats) * 100}%` }} />
                  </div>
                  <p className="text-[11px] text-gray-400 mb-4">{event.availableSeats} / {event.totalSeats} seats left</p>
                  <Link to={`/events/${event._id}`} className="block w-full text-center bg-gray-900 hover:bg-black text-white text-sm font-medium py-2.5 rounded-lg transition">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showFilters && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowFilters(false)}>
          <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="text-sm text-gray-500 hover:text-black font-medium">Close</button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Category</label>
                <select value={tempFilters.category} onChange={(e) => setTempFilters({ ...tempFilters, category: e.target.value })} className="w-full mt-2 p-3 text-base bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none">
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Location</label>
                <select value={tempFilters.location} onChange={(e) => setTempFilters({ ...tempFilters, location: e.target.value })} className="w-full mt-2 p-3 text-base bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none">
                  {locations.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-medium text-gray-500 uppercase">Max Price</label>
                  <span className="text-base font-semibold text-gray-800">₹{tempFilters.price}</span>
                </div>
                <input type="range" min="0" max="5000" step="100" value={tempFilters.price} onChange={(e) => setTempFilters({ ...tempFilters, price: Number(e.target.value) })} className="w-full accent-black cursor-pointer" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => { setFilters(INITIAL_FILTERS); setTempFilters(INITIAL_FILTERS); }} className="flex-1 py-3 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition">Reset</button>
                <button onClick={() => { setFilters(tempFilters); setShowFilters(false); }} className="flex-1 py-3 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-900 transition">Apply</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;