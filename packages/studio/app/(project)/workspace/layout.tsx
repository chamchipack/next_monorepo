"use client";
import React from "react";
import Header from "@/components/sample/Header";
import Sidebar from "@/components/sample/Sidebar";
import _ from "./_";

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
        <_ children={children} />
      </div>
    </>
  );
}
