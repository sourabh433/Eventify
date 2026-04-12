import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaTicketAlt, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);

    // Effect to handle scroll glassmorphism intensity
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

    return (
        <nav className={`sticky top-0 z-50 px-4 py-3 md:px-8 transition-all duration-300 `}>
            <div className="max-w-7xl mx-auto">
                <div className={`
                    transition-all duration-500 flex justify-between items-center px-6 py-3 rounded-[2rem]
                    ${isScrolled 
                        ? 'bg-white/70 backdrop-blur-2xl shadow-2xl shadow-blue-900/10 border border-white/40' 
                        : 'bg-white/90 backdrop-blur-xl shadow-xl shadow-blue-900/5 border border-transparent'}
                `}>
                    
                    {/* Brand Logo - Updated with Blue Gradient Text */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-2 md:p-2.5 rounded-2xl shadow-lg shadow-blue-200 group-hover:rotate-12 transition-all duration-300">
                            <FaTicketAlt className="text-white text-lg md:text-xl" />
                        </div>
                        <span className="text-xl md:text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                            Eventify
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-2 sm:gap-6">
                        <Link 
                            to="/" 
                            className="hidden sm:block text-slate-600 hover:text-blue-600 text-sm font-black uppercase tracking-widest transition-colors px-3"
                        >
                            Explore
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-2 md:gap-4 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
                                <Link 
                                    to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                                    className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-xl shadow-sm border border-slate-200 hover:bg-blue-50 transition-all group"
                                >
                                    <FaUserCircle className="text-lg text-blue-500 group-hover:text-blue-600" />
                                    <span className="hidden md:block text-xs font-black uppercase tracking-tighter">
                                        {user.name.split(' ')[0]}
                                    </span>
                                </Link>

                                <button 
                                    onClick={handleLogout} 
                                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl"
                                    title="Logout"
                                >
                                    <FaSignOutAlt className="text-lg" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 sm:gap-4">
                                <Link 
                                    to="/login" 
                                    className="text-slate-600 hover:text-blue-600 text-xs sm:text-sm font-black uppercase tracking-widest transition-all"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-lg shadow-blue-200 transition-all transform hover:scale-105 active:scale-95"
                                >
                                    Join Now
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