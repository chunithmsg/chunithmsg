"use client";

import Link from "next/link";
import { Menu } from "antd";
import { usePathname } from "next/navigation";

const links = {
  Leaderboard: "/",
  Rules: "/rules",
  Submission:
    "https://docs.google.com/forms/d/e/1FAIpQLSdtahyQGjHnLUg3bprDW8Q5qRaGVToAE2rfuzYcLrq0hveXyw/viewform",
};

const NavBar = () => {
  const pathname = usePathname();

  return (
    <Menu
      mode="horizontal"
      items={Object.entries(links).map(([key, href]) => ({
        label: <Link href={href}>{key}</Link>,
        key: key,
      }))}
      selectedKeys={Object.entries(links).flatMap(([key, href]) =>
        pathname === href ? [key] : []
      )}
    />
  );
};

export default NavBar;
