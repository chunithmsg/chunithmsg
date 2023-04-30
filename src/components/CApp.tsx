"use client";

import { App } from "antd";
import NavBar from "./NavBar";
import React from "react";

const CApp = ({ children }: { children: React.ReactNode }) => (
  <App>
    <NavBar />
    {children}
  </App>
);

export default CApp;
