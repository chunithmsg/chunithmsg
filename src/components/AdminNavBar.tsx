'use client';

import Link from 'next/link';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';

const AdminNavBar = () => (
  <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-14 max-w-screen-2xl justify-center items-center">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className="m-0">
            <Link href="/admin" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Control Panel
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="m-0">
            <Link href="/admin/new-play" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                New Play
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="m-0">
            <Link href="/admin/new-competition" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                New Competition
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  </header>
);

export default AdminNavBar;
