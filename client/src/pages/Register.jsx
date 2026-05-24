import React, { useState, useContext } from 'react';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaCheckCircle } from "react-icons/fa";
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { getErrorMessage } from "../utils/errorHandler";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, verifyOtp } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const emailValid =
      email.endsWith("@gmail.com") || email.endsWith("@eventify.com");

    if (!emailValid) {
      setError("Please enter a valid email (@gmail.com or @eventify.com)");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      if (!showOTP) {
        await register(name, email, password);
        setShowOTP(true);
      } else {
        await verifyOtp(email, otp);
        navigate('/dashboard');
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

      {/* CARD (MATCH LOGIN SIZE) */}
      <div className="w-full max-w-md max-h-[95vh] overflow-hidden bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-[1.8rem] shadow-2xl border border-white/40 flex flex-col">

        {/* HEADER */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex bg-gradient-to-br from-blue-400 to-blue-600 p-2 rounded-xl shadow-lg text-white mb-2">
            <FaUser size={18} />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            {showOTP ? 'Verify Account' : 'Create Account'}
          </h2>

          <p className="text-slate-500 text-[11px] sm:text-xs mt-1">
            {showOTP ? 'Check your email for OTP' : 'Join Eventify now'}
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
              {/* NAME */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                  Full Name
                </label>

                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />

                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-50 border text-sm border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                  Email Address
                </label>

                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />

                  <input
                    type="email"
                    placeholder="user@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-50 border text-sm border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                    required
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
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-slate-50 border text-sm border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                    required
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
              <div className="bg-green-50 text-green-600 p-2 rounded-lg text-[11px] font-semibold border border-green-100 flex items-center gap-2">
                <FaCheckCircle size={12} />
                OTP sent to your email
              </div>

              <input
                type="text"
                placeholder="0 0 0 0 0 0"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-dashed border-blue-200 bg-blue-50/30 text-center text-lg font-bold tracking-[0.3em] text-blue-600 outline-none"
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
            {loading ? "Loading..." : showOTP ? "Verify & Continue" : "Create Account"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center mt-3 text-[11px] text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-bold">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;