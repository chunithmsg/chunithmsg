"use client";

import React from "react";
import { App } from "antd";
import NavBar from "./NavBar";

const CApp = ({ children }: { children: React.ReactNode }) => (
  <App>
    <NavBar />
    {children}
  </App>
);

export default CApp;
