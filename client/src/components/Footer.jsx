import React from "react";
import { FaTicketAlt, FaGithub, FaTwitter, FaLinkedin, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-blue-100 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">

          {/* BRAND COLUMN - Matched to Navbar */}
          <div className="col-span-1 lg:col-span-1 space-y-6 text-center lg:text-left">
            <Link to="/" className="flex items-center justify-center lg:justify-start gap-3 group">
              {/* Icon Matched: from-blue-400 to-blue-600 */}
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-200 group-hover:rotate-12 transition-all duration-300">
                <FaTicketAlt className="text-white text-xl" />
              </div>
              {/* Text Matched: from-blue-400 via-blue-500 to-indigo-500 */}
              <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Eventify
              </span>
            </Link>

            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto lg:mx-0 font-medium">
              Discover, book, and manage amazing events with a fast, secure, and modern booking experience.
            </p>

            <div className="flex justify-center lg:justify-start gap-4">
              {[FaGithub, FaTwitter, FaLinkedin].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* LINKS COLUMNS */}
          <div className="grid grid-cols-2 md:grid-cols-3 col-span-1 lg:col-span-3 gap-8">

            {/* QUICK LINKS */}
            <div className="text-center md:text-left">
              <h3 className="text-slate-900 font-bold uppercase tracking-widest text-[11px] mb-6">Explore</h3>
              <ul className="space-y-4 text-sm font-bold text-slate-500">
                <li><Link className="hover:text-blue-500 transition-colors" to="/">Home</Link></li>
                <li><Link className="hover:text-blue-500 transition-colors" to="/">All Events</Link></li>
                <li><Link className="hover:text-blue-500 transition-colors" to="/dashboard">My Dashboard</Link></li>
              </ul>
            </div>

            {/* SUPPORT */}
            <div className="text-center md:text-left">
              <h3 className="text-slate-900 font-bold uppercase tracking-widest text-[11px] mb-6">Support</h3>
              <ul className="space-y-4 text-sm font-bold text-slate-500">
                <li><a href="#" className="hover:text-blue-500 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            {/* CONTACT INFO */}
            <div className="text-center md:text-left col-span-2 md:col-span-1">
              <h3 className="text-slate-900 font-bold uppercase tracking-widest text-[11px] mb-6">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-center md:justify-start gap-3 text-sm font-bold text-slate-600">
                  <FaEnvelope className="text-blue-400" />
                  <span>support@eventify.com</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3 text-sm font-bold text-slate-600">
                  <FaPhoneAlt className="text-blue-400" />
                  <span>+91 10101 01010</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3 text-sm font-bold text-slate-600">
                  <FaMapMarkerAlt className="text-blue-400" />
                  <span>India</span>
                </div>
                <div className="pt-2">
                  <Link to="/contact" className="inline-block text-xs font-black text-blue-500 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-all underline-none">
                    Send Feedback →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center gap-1">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tight">
            © {new Date().getFullYear()}
            <span className="text-blue-400 font-black mx-1">EVENTIFY</span>
            All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;