import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSearch,
  FaFilter,
  FaRegClock,
  FaTicketAlt,
  FaShieldAlt,
} from "react-icons/fa";
import api from "../utils/axios";
import { EventCardSkeleton } from "../components/skeletons/Skeletons";

const INITIAL_FILTERS = {
  category: "Genre",
  location: "City",
  price: 5000,
  sort: "",
};

const Home = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [tempFilters, setTempFilters] = useState(INITIAL_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [placeholder, setPlaceholder] = useState("Search experiences...");

  const phrases = ["Comedy shows", "Live music", "Dinner dates", "Art galleries"];
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const eventsRef = useRef(null);

  // --- Effects ---

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder((prev) => {
        const nextIndex = (phrases.indexOf(prev) + 1) % phrases.length;
        return phrases[nextIndex];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Handlers ---

  const scrollToEvents = (e) => {
    if (e) e.preventDefault(); // Handles form submission/Enter key
    setShowSuggestions(false);
    if (eventsRef.current) {
      eventsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="text-blue-500 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // --- Memoized Logic ---

  const filteredEvents = useMemo(() => {
    return allEvents
      .filter((event) => {
        const searchTerms = debouncedQuery.toLowerCase().split(" ").filter(Boolean);
        const matchesSearch =
          searchTerms.length === 0 ||
          searchTerms.every(
            (word) =>
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
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allEvents
      .filter(
        (event) =>
          event.title?.toLowerCase().includes(q) ||
          event.category?.toLowerCase().includes(q) ||
          event.location?.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [allEvents, query]);

  const categories = ["Genre", ...new Set(allEvents.map((e) => e.category))];
  const locations = ["City", ...new Set(allEvents.map((e) => e.location))];
  const isDropdownOpen = showSuggestions && suggestions.length > 0;

  return (
    <div className="flex flex-col min-h-screen px-4 md:px-8">
      {/* HERO SECTION */}
      <div className="relative min-h-[520px] md:min-h-[650px] rounded-[2rem] md:rounded-[3rem] mb-12 md:mb-16 overflow-hidden bg-gradient-to-br from-sky-400 via-blue-400 to-indigo-300">
        
        {/* VIDEO BACKGROUND LAYER */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-100"
        >
          <source src="https://www.pexels.com/download/video/35447926/" type="video/mp4" />
        </video>

        {/* GLASSY OVERLAY SHAPES */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-25%] right-[-10%] w-[85%] h-[85%] bg-white/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-25%] left-[-10%] w-[75%] h-[75%] bg-blue-200/30 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 py-16 md:py-24 text-center">
          {/* Tag */}
          <div className="mb-8">
            <div className="px-5 py-2 rounded-full bg-white/25 backdrop-blur-lg border border-white/40 shadow-sm">
              <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-white">
                ✨ Explore • Book • Enjoy
              </span>
            </div>
          </div>

          {/* Search Bar - Form to handle Enter key */}
          <form
            onSubmit={scrollToEvents}
            className="w-full max-w-2xl mb-12 relative z-50"
          >
            <div
              className={`
              relative flex items-center backdrop-blur-xl bg-white/80 p-2 transition-all duration-200
              ${isDropdownOpen ? "rounded-t-2xl shadow-xl border border-white/60" : "rounded-full shadow-lg border border-white/60"}
            `}
            >
              <button
                type="button"
                onClick={() => {
                  setTempFilters(filters);
                  setShowFilters(true);
                }}
                className="flex items-center gap-2 px-3 py-2 text-blue-500 hover:text-blue-700"
              >
                <FaFilter className="text-sm" />
              </button>

              <input
                ref={inputRef}
                type="text"
                placeholder={`Search events like ${placeholder}...`}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full px-2 py-2 text-sm md:text-base text-blue-900 placeholder:text-grey-400 bg-transparent outline-none font-medium"
              />

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 md:px-6 py-2.5 rounded-full text-xs md:text-sm font-semibold shadow-md hover:shadow-lg transition"
              >
                Search
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute left-0 right-0 top-full bg-white/95 backdrop-blur-xl rounded-b-2xl border border-white/60 shadow-xl overflow-hidden"
              >
                <div className="max-h-[320px] overflow-y-auto custom-scrollbar bg-white rounded-b-xl shadow-xl border border-gray-100">
                  {suggestions.map((event, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setQuery(event.title);
                        setShowSuggestions(false);
                        setTimeout(() => scrollToEvents(), 100);
                      }}
                      className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-all duration-200 border-b border-gray-50 last:border-none group"
                    >
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                        <FaSearch size={14} />
                      </div>
                      <div className="flex flex-col text-left flex-1">
                        <span className="text-[15px] font-semibold text-gray-800 leading-tight">
                          {highlightText(event.title, query)}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">{event.category}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-[11px] text-gray-400 italic">{event.location}</span>
                        </div>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="px-2.5 py-1 text-[13px] font-bold bg-blue-50 text-blue-700 rounded-lg border border-blue-100/50">
                          ₹{event.ticketPrice}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>

          <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-white leading-none tracking-tight">
            Discover Moments <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-50 to-blue-100">
              That Matter
            </span>
          </h1>

          <p className="mt-6 text-blue-50 text-sm md:text-lg max-w-xl font-medium opacity-90 drop-shadow-md">
            Find events, experiences and memories near you — all in one place.
          </p>

          <div className="mt-12 flex items-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-white text-xl md:text-3xl font-black">10K+</div>
              <div className="text-[10px] text-blue-100 uppercase tracking-widest font-bold">Happy Users</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <div className="text-white text-xl md:text-3xl font-black">500+</div>
              <div className="text-[10px] text-blue-100 uppercase tracking-widest font-bold">Live Events</div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-4">
        {[
          {
            icon: <FaRegClock />,
            title: "Fast Booking",
            desc: "Secure tickets instantly with our streamlined infrastructure.",
          },
          {
            icon: <FaTicketAlt />,
            title: "Seamless Access",
            desc: "Manage and download tickets directly from your dashboard.",
          },
          {
            icon: <FaShieldAlt />,
            title: "Secure Platform",
            desc: "Transactions protected by cutting-edge encryption.",
          },
        ].map((feature, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center p-10 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-200/40 hover:-translate-y-2 group transition-all duration-500"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl mb-8 shadow-lg shadow-blue-200/60 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
              {feature.icon}
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-4 tracking-tight group-hover:bg-gradient-to-r group-hover:from-sky-500 group-hover:to-indigo-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
              {feature.title}
            </h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* EVENTS GRID */}
      <div ref={eventsRef} className="scroll-mt-32">
        <div className="flex items-center justify-between mb-8 border-b border-blue-50 pb-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-700 tracking-tight">Upcoming Events</h2>
          <div className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
            {filteredEvents.length} Results
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 text-slate-400 font-medium bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            No events found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredEvents.map((event) => (
              <div
                key={event._id}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="h-48 bg-slate-100 relative overflow-hidden">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-semibold">
                      {event.category}
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow text-gray-500 border border-blue-50">
                    {event.ticketPrice === 0 ? "Free" : `₹${event.ticketPrice}`}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-[11px] font-bold text-blue-500 uppercase tracking-widest mb-1">{event.category}</span>
                  <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h3>
                  <div className="space-y-2 text-sm text-slate-500 mb-5">
                    <div className="flex items-center gap-2 font-medium">
                      <FaCalendarAlt className="text-blue-400 text-xs" /> {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                      <FaMapMarkerAlt className="text-blue-400 text-xs" /> {event.location}
                    </div>
                  </div>
                  <div className="mt-auto">
                    <Link
                      to={`/events/${event._id}`}
                      className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-sm font-black py-3 rounded-xl transition-all shadow-lg shadow-blue-100 uppercase tracking-tight active:scale-95"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FILTERS MODAL */}
      {showFilters && (
        <div
          className="fixed inset-0 backdrop-blur-md z-[100] flex items-center justify-center p-4 bg-black/10"
          onClick={() => setShowFilters(false)}
        >
          <div
            className="w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-3xl p-6 border shadow-[0_20px_50px_rgba(59,130,246,0.12)] relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Filter Events</h2>
                <p className="text-xs text-gray-500">Refine your search easily</p>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-200 hover:bg-red-100 text-gray-400 hover:text-red-500 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
                <select
                  value={tempFilters.category}
                  onChange={(e) => setTempFilters({ ...tempFilters, category: e.target.value })}
                  className="w-full p-3 text-sm bg-white border border-gray-200 rounded-xl outline-none text-gray-700"
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
                <select
                  value={tempFilters.location}
                  onChange={(e) => setTempFilters({ ...tempFilters, location: e.target.value })}
                  className="w-full p-3 text-sm bg-white border border-gray-200 rounded-xl outline-none text-gray-700"
                >
                  {locations.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-gray-600">Max Price</label>
                  <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    ₹{tempFilters.price}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={tempFilters.price}
                  onChange={(e) => setTempFilters({ ...tempFilters, price: Number(e.target.value) })}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="flex gap-3 pt-5">
                <button
                  onClick={() => {
                    setFilters(INITIAL_FILTERS);
                    setTempFilters(INITIAL_FILTERS);
                  }}
                  className="flex-1 py-2.5 text-sm font-medium text-red-500 border border-red-200 rounded-xl bg-red-50 hover:bg-red-500 hover:text-white transition"
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    setFilters(tempFilters);
                    setShowFilters(false);
                    setTimeout(() => scrollToEvents(), 100);
                  }}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-500 rounded-xl shadow-lg"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;