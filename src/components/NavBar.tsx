"use client";

import Link from "next/link";
import { Menu } from "antd";
import { usePathname } from "next/navigation";
import { submissionUrl } from "@/utils/constants";

const links = {
  Leaderboard: "/",
  Rules: "/rules",
  Submission: submissionUrl,
};

const NavBar = () => {
  const pathname = usePathname();

  return (
    <Menu
      mode="horizontal"
      items={Object.entries(links).map(([key, href]) => ({
        label: <Link href={href}>{key}</Link>,
        key,
      }))}
      selectedKeys={Object.entries(links).flatMap(([key, href]) =>
        pathname === href ? [key] : []
      )}
    />
  );
};

export default NavBar;
