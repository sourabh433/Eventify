import React, { useState, useContext } from 'react';
import { FaEye, FaEyeSlash, FaLock, FaEnvelope, FaShieldAlt } from "react-icons/fa";
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { getErrorMessage } from "../utils/errorHandler";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, verifyOtp } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        const emailValid = email.endsWith("@gmail.com") || email.endsWith("@eventify.com");

        if (!emailValid) {
            setError("Please enter a valid email (@gmail.com or @eventify.com)");
            setLoading(false);
            return;
        }
        
        try {
            if (!showOTP) {
                const data = await login(email, password);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            } else {
                const data = await verifyOtp(email, otp);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            }
        } catch (err) {
            if (err.needsVerification) setShowOTP(true);
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-white/40">
                
                {/* Header with Blue Gradient Text */}
                <div className="text-center mb-10">
                    <div className="inline-flex bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200 mb-4 text-white">
                        <FaShieldAlt size={24} />
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                        {showOTP ? 'Secure Verify' : 'Welcome Back'}
                    </h2>
                    <p className="text-slate-500 font-medium text-sm mt-1">
                        {showOTP ? 'Check your email for the code' : 'Sign in to your Eventify account'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3.5 rounded-2xl mb-6 text-xs font-bold border border-red-100 flex items-center gap-2 animate-shake">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!showOTP ? (
                        <>
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                <div className="relative group">
                                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="user@gmail.com"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-300"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                                <div className="relative group">
                                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-300"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* OTP Field */
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 text-center block">Verification Code</label>
                            <input
                                type="text"
                                required
                                placeholder="0 0 0 0 0 0"
                                className="w-full px-4 py-4 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/30 focus:border-blue-500 focus:bg-white transition-all outline-none font-black tracking-[0.5em] text-center text-2xl text-blue-600"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength="6"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            showOTP ? 'Confirm & Sign In' : 'Sign In Now'
                        )}
                    </button>
                </form>

                <p className="text-center mt-10 text-slate-500 text-sm font-bold">
                    Don't have an account? <Link to="/register" className="text-blue-600 hover:text-blue-400 underline decoration-2 underline-offset-4 transition-colors">Create one free</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;