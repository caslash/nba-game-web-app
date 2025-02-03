export type SiteConfig = typeof siteConfig;

type NavItem = {
  label: string;
  href: string;
};

export const siteConfig: { name: string; navItems: NavItem[] } = {
  name: 'NBA Career Game',
  navItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Players',
      href: '/players',
    },
    {
      label: 'Multiplayer',
      href: '/multiplayer',
    },
    {
      label: 'Single Player',
      href: '/singleplayer',
    },
  ],
};
