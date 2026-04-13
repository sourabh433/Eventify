import React from "react";
import { Link } from "react-router-dom";
import { FaTicketAlt, FaGithub, FaTwitter, FaLinkedin, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 mt-20 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">

        {/* Top Section: Brand Identity */}
        <div className="flex flex-col items-center text-center mb-16">
          <Link to="/" className="flex items-center gap-3 group mb-4 w-fit">
            <div className="bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-2.5 rounded-2xl shadow-xl shadow-blue-200/40 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
              <FaTicketAlt className="text-white text-xl" />
            </div>

            <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent group-hover:brightness-110 transition-all duration-500">
              Eventify
            </span>
          </Link>
          <p className="text-slate-500 text-sm max-w-sm font-medium leading-relaxed">
            The premium way to discover, book, and manage your events with confidence and style.
          </p>
          <div className="flex gap-4 mt-6">
            {[FaGithub, FaTwitter, FaLinkedin].map((Icon, idx) => (
              <a key={idx} href="#" className="text-blue-600 hover:text-blue-500 transition-colors">
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Middle Section: Organized Grid (Lines Removed) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8 lg:gap-16 text-center sm:text-left mb-16 px-4">

          {/* Column 1: Explore */}
          <div>
            <h3 className="text-slate-900 font-bold uppercase tracking-[0.2em] text-[11px] mb-8">
              Explore
            </h3>
            <ul className="space-y-4 text-sm font-semibold text-slate-500">
              <li><Link className="hover:text-blue-600 hover:translate-x-1 inline-block transition-all duration-300" to="/">Home</Link></li>
              <li><Link className="hover:text-blue-600 hover:translate-x-1 inline-block transition-all duration-300" to="/">All Events</Link></li>
              <li><Link className="hover:text-blue-600 hover:translate-x-1 inline-block transition-all duration-300" to="/dashboard">My Dashboard</Link></li>
            </ul>
          </div>

          {/* Column 2: Support */}
          <div>
            <h3 className="text-slate-900 font-bold uppercase tracking-[0.2em] text-[11px] mb-8">
              Support
            </h3>
            <ul className="space-y-4 text-sm font-semibold text-slate-500">
              <li><a href="#" className="hover:text-blue-600 hover:translate-x-1 inline-block transition-all duration-300">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-600 hover:translate-x-1 inline-block transition-all duration-300">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-600 hover:translate-x-1 inline-block transition-all duration-300">Terms of Service</a></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-slate-900 font-bold uppercase tracking-[0.2em] text-[11px] mb-8">
              Contact Us
            </h3>
            <ul className="space-y-5 text-sm font-semibold text-slate-500">
              <li className="flex items-center justify-center sm:justify-start gap-4 group/item">
                <FaEnvelope size={18} className="text-blue-500 shrink-0 group-hover/item:scale-110 transition-transform" />
                <span className="text-slate-600">support@eventify.com</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-4 group/item">
                <FaPhoneAlt size={18} className="text-blue-500 shrink-0 group-hover/item:scale-110 transition-transform" />
                <span className="text-slate-600">+91 10101 01010</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-4 group/item">
                <FaMapMarkerAlt size={18} className="text-blue-500 shrink-0 group-hover/item:scale-110 transition-transform" />
                <span className="text-slate-600">Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Final CTA & Copyright */}
        <div className="pt-10 border-t border-slate-100 flex flex-col items-center gap-6">
          <Link
            to="/contact"
            className="group relative flex items-center gap-3 text-xs font-black text-white px-9 py-4 rounded-full overflow-hidden transition-all duration-500 shadow-xl shadow-blue-200/50 hover:shadow-indigo-300/60 hover:-translate-y-1 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 transition-all duration-500 group-hover:hue-rotate-15" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out" />
            <span className="relative z-10 uppercase tracking-[0.15em]">
              Get In Touch
            </span>
            <FaArrowRight className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300 ease-out" />
          </Link>

          <div className="flex flex-col items-center gap-2">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} <span className="text-slate-900">Eventify</span> All Rights Reserved
            </p>
            <div className="h-1 w-10 bg-blue-500 rounded-full opacity-30" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;