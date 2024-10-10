import React from "react";
import HeaderContainer from "@/components/layout/client/header/HeaderContainer";
import BodyContainer from "@/components/layout/server/BodyContainer";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <HeaderContainer />
      <BodyContainer children={children} />
    </>
  );
}
