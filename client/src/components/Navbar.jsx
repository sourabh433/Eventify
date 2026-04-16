import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaTicketAlt, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Helper for active link styling
    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`sticky top-0 z-50 px-4 py-4 md:px-8 transition-all duration-500 ${isScrolled ? 'py-2' : 'py-4'}`}>
            <div className="max-w-7xl mx-auto">
                <div className={`
                    transition-all duration-500 flex justify-between items-center px-6 py-2.5 rounded-[2.5rem]
                    ${isScrolled
                        ? 'bg-white/70 backdrop-blur-md shadow-[0_8px_32px_rgba(15,23,42,0.1)] border border-white/40'
                        : 'bg-white/30 backdrop-blur-sm border border-white/20'}
                `}>

                    <Link to="/" className="flex items-center gap-3 group">
                        {/* The Icon Container */}
                        <div className="bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-200/50 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                            <FaTicketAlt className="text-white text-lg md:text-xl" />
                        </div>

                        {/* The Restyled Text */}
                        <span className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                            Eventify
                        </span>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-2 sm:gap-6">
                        <Link
                            to="/"
                            className={`hidden sm:block text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:text-sky-600 ${isActive('/') ? 'text-sky-600' : 'text-slate-600'}`}
                        >
                            Explore
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-2 md:gap-3 bg-white/50 p-1 rounded-[1.5rem] border border-white/60 shadow-inner">
                                {/* Profile Link with Pro Hover Effect */}
                                <Link
                                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                    className="flex items-center gap-2 px-4 py-2 bg-white text-sky-600 rounded-[1.2rem] shadow-sm border border-slate-100 hover:bg-gradient-to-r hover:from-sky-500 hover:to-indigo-500 hover:text-white hover:border-transparent hover:shadow-blue-200 transition-all duration-300 group"
                                >
                                    <FaUserCircle className="text-lg text-sky-500 group-hover:text-white transition-colors duration-300" />
                                    <span className="hidden md:block text-[10px] font-black uppercase tracking-widest">
                                       {user?.name?.split(' ')[0] || 'User'}
                                    </span>
                                </Link>

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
                                    title="Logout"
                                >
                                    <FaSignOutAlt className="text-lg" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 sm:gap-5">
                                <Link
                                    to="/login"
                                    className="text-slate-700 hover:text-sky-600 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="relative overflow-hidden group bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-[10px] sm:text-xs shadow-xl transition-all duration-300 active:scale-95 uppercase tracking-widest"
                                >
                                    <span className="relative z-10">Join Now</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;