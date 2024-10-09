import React from "react";
import Header from "@/components/sample/Header";
import Sidebar from "@/components/sample/Sidebar";
import NodeComponent from "./NodeComponent";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <div
        style={{
          // minHeight: "100vh",
          display: "flex",
        }}
      >
        <Sidebar />
        <NodeComponent children={children} />
      </div>
    </>
  );
}
