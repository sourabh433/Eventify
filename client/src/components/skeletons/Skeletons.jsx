import React from "react";

// 🔵 EVENT CARD SKELETON (Home)
export const EventCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>

      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-6 bg-gray-200 rounded w-2/3"></div>

        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>

        <div className="h-10 bg-gray-200 rounded mt-4"></div>
      </div>
    </div>
  );
};

// 🔵 EVENT DETAIL SKELETON
export const EventDetailSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-8 animate-pulse">
      <div className="h-80 bg-gray-200"></div>

      <div className="p-8 space-y-4">
        <div className="h-6 bg-gray-200 w-1/4 rounded"></div>
        <div className="h-10 bg-gray-200 w-2/3 rounded"></div>

        <div className="h-4 bg-gray-200 w-full rounded"></div>
        <div className="h-4 bg-gray-200 w-5/6 rounded"></div>

        <div className="h-40 bg-gray-100 rounded-xl mt-6"></div>
      </div>
    </div>
  );
};

// 🔵 USER DASHBOARD SKELETON
export const UserDashboardSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto animate-pulse">
      <div className="h-24 bg-gray-200 rounded-xl mb-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    </div>
  );
};

