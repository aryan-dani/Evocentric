import React from "react";
import { User } from "lucide-react";

const Topbar = () => {
  return (
    <div className="h-16 bg-white shadow-md flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">City-Wide Smart EV Charging</h1>
      <div className="flex items-center">
        <User className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
};

export default Topbar;
