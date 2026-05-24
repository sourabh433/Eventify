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

        const emailValid =
            email.endsWith("@gmail.com") ||
            email.endsWith("@eventify.com");

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
        <div className="min-h-screen flex items-center justify-center px-3 py-4 bg-slate-50 overflow-hidden">

            {/* CARD */}
            <div className="w-full max-w-md max-h-[95vh] overflow-hidden bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-[1.8rem] shadow-2xl border border-white/40 flex flex-col">

                {/* HEADER (smaller) */}
                <div className="text-center mb-4 sm:mb-6">
                    <div className="inline-flex bg-gradient-to-br from-blue-400 to-blue-600 p-2 rounded-xl shadow-lg text-white mb-2">
                        <FaShieldAlt size={18} />
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                        {showOTP ? 'Secure Verify' : 'Welcome Back'}
                    </h2>

                    <p className="text-slate-500 text-[11px] sm:text-xs mt-1">
                        {showOTP ? 'Check your email for code' : 'Sign in to Eventify'}
                    </p>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="bg-red-50 text-red-600 p-2.5 rounded-lg mb-3 text-[11px] font-semibold border border-red-100 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
                        {error}
                    </div>
                )}

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-3 flex-1">

                    {!showOTP ? (
                        <>
                            {/* EMAIL */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                                    Email Address
                                </label>

                                <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />

                                    <input
                                        type="email"
                                        required
                                        placeholder="user@gmail.com"
                                        className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-50 border text-sm border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                                    Password
                                </label>

                                <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-slate-50 border text-sm border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    >
                                        {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* OTP */
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center block">
                                Verification Code
                            </label>

                            <input
                                type="text"
                                required
                                placeholder="0 0 0 0 0 0"
                                className="w-full px-3 py-2.5 rounded-lg border border-dashed border-blue-200 bg-blue-50/30 text-center text-lg sm:text-xl font-bold tracking-[0.3em] text-blue-600 outline-none"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength="6"
                            />
                        </div>
                    )}

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg text-sm shadow-md active:scale-[0.98] disabled:opacity-70"
                    >
                        {loading ? "Loading..." : showOTP ? "Verify" : "Login"}
                    </button>

                    {/* DEMO BOX (SMALL) */}
                    <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-[10px] space-y-0.5">
                        <p className="font-bold text-blue-600 text-[11px]">
                            Demo Credentials
                        </p>

                        <p>Admin: admin@eventify.com</p>
                        <p>Password: pass123</p>
                        
                        <p>user : {" "}
                            <Link to="/register" className="text-blue-600 font-bold">
                                Register now
                            </Link>
                        </p>
                    </div>
                </form>

                {/* FOOTER */}
                <p className="text-center mt-3 text-[11px] text-slate-500">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 font-bold">
                        Register Now
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;