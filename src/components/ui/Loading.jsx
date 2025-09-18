import React from "react";

const Loading = ({ type = "cards", count = 6 }) => {
  if (type === "kanban") {
    return (
      <div className="flex gap-6 p-6">
        {[1, 2, 3].map((column) => (
          <div key={column} className="flex-1 bg-surface rounded-xl border p-4">
            <div className="skeleton h-6 w-24 mb-4 rounded"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((card) => (
                <div key={card} className="skeleton h-20 rounded-lg"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "timeline") {
    return (
      <div className="space-y-4 p-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="skeleton w-32 h-4 rounded"></div>
            <div className="flex-1 skeleton h-8 rounded"></div>
            <div className="skeleton w-20 h-4 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-surface border rounded-xl p-6 space-y-4">
          <div className="skeleton h-6 w-3/4 rounded"></div>
          <div className="skeleton h-4 w-full rounded"></div>
          <div className="skeleton h-4 w-2/3 rounded"></div>
          <div className="flex justify-between items-center">
            <div className="skeleton h-8 w-16 rounded-full"></div>
            <div className="skeleton h-4 w-20 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;