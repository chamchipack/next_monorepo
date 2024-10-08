"use client";
import React, { useState } from "react";

import StudentFilter from "@/components/v2/Student/StudentFilter";
import StudentGrid from "@/components/v2/Student/StudentGrid";

const MainPage = () => {
  return (
    <>
      <StudentFilter />
      <StudentGrid />
    </>
  );
};

export default MainPage;
