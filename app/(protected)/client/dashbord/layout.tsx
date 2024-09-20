"use client";
import { ReactNode } from "react";
type Props = {
  children: ReactNode; // Les enfants seront passés et rendus
};

const Layout = ({ children }: Props) => {
  return <>{children}</>;
};

export default Layout;
