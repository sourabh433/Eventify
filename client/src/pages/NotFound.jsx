import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-100 px-4 overflow-hidden">
      <div className="text-center max-w-sm">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-800">
          404
        </h1>
        <h2 className="text-lg sm:text-xl font-semibold text-slate-700 mt-2">
          Page Not Found
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          The page you are looking for doesn’t exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block mt-4 bg-slate-700 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition text-sm"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;