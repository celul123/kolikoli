import React from "react";
import Sidebar from "./_components/sidebar";

const PanelLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-[256px] w-full p-8">{children}</div>
    </div>
  );
};

export default PanelLayout;
