import React from "react";

const SkeletonCard = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border animate-pulse">
      {/* IMAGE SKELETON */}
      <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>

      {/* TITLE */}
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>

      {/* TEXT LINE */}
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>

      {/* BUTTON */}
      <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
    </div>
  );
};

export default SkeletonCard;