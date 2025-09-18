import React from "react";
import DashboardStats from "@/components/organisms/DashboardStats";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold gradient-text">Project Dashboard</h1>
            <p className="text-secondary mt-2">
              Track your team's progress and manage projects efficiently
            </p>
          </div>
          
          <DashboardStats />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;