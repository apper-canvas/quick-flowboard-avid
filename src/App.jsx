import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import Dashboard from "@/components/pages/Dashboard";
import Projects from "@/components/pages/Projects";
import Board from "@/components/pages/Board";
import Timeline from "@/components/pages/Timeline";
import Team from "@/components/pages/Team";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/board" element={<Board />} />
            <Route path="/board/:projectId" element={<Board />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/timeline/:projectId" element={<Timeline />} />
            <Route path="/team" element={<Team />} />
          </Routes>
        </main>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
        className="toast-container"
      />
    </BrowserRouter>
  );
}

export default App;