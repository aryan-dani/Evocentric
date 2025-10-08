import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Users,
  BatteryCharging,
  Car,
  FileText,
  AlertTriangle,
} from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold">
        <Link to="/">EV-DBMS</Link>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        <Link
          to="/"
          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
        >
          <Home className="mr-3" />
          Dashboard
        </Link>
        <Link
          to="/users"
          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
        >
          <Users className="mr-3" />
          Users
        </Link>
        <Link
          to="/stations"
          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
        >
          <BatteryCharging className="mr-3" />
          Stations
        </Link>
        <Link
          to="/parking"
          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
        >
          <Car className="mr-3" />
          Parking
        </Link>
        <Link
          to="/reservations"
          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
        >
          <FileText className="mr-3" />
          Reservations
        </Link>
        <Link
          to="/penalties"
          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
        >
          <AlertTriangle className="mr-3" />
          Penalties
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
