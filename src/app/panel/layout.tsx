import React from "react";
import Sidebar from "./_components/sidebar";

const PanelLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
};

export default PanelLayout;
