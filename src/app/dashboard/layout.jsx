// app/layout.js
import React from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 lg:ml-64 w-full overflow-x-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}