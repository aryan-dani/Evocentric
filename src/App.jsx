import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Stations from "./pages/Stations";
import Parking from "./pages/Parking";
import Reservations from "./pages/Reservations";
import Penalties from "./pages/Penalties";

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/stations" element={<Stations />} />
              <Route path="/parking" element={<Parking />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/penalties" element={<Penalties />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
