'use client';

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react';
import { link as linkStyles } from '@heroui/theme';
import clsx from 'clsx';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

import { siteConfig } from '@/config/site';
import ProfileView from './profileview';
import ThemeSwitcher from './themeswitcher';

export default function NBANavbar() {
  const pathName = usePathname();

  return (
    <Navbar maxWidth="full" position="static">
      <NavbarBrand />
      <NavbarContent justify="center">
        <ul className="flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href} isActive={pathName === item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium',
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>
      <NavbarContent justify="end">
        <ProfileView />
        <ThemeSwitcher />
      </NavbarContent>
    </Navbar>
  );
}
