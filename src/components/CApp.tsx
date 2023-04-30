"use client";

import { App } from "antd";
import NavBar from "./NavBar";

const CApp = ({ children }) => (
  <App>
    <NavBar />
    {children}
  </App>
);

export default CApp;
