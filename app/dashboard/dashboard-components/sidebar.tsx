'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import React from 'react';

import { cn } from '~/lib/utils';

import { create } from 'zustand';

import { Button } from '~/components/ui/button';

import {
  House,
  PanelLeftClose,
  PanelLeftOpen,
  PencilRuler,
} from 'lucide-react';

interface SidebarStore {
  isOpen: boolean;
  toggle: () => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

const sidebarItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    Icon: House,
  },
  {
    name: 'Create Invoice',
    href: '/dashboard/create-invoice',
    Icon: PencilRuler,
  },
];

const SidebarItem = ({ name, href, Icon }: (typeof sidebarItems)[number]) => {
  const pathname = usePathname();
  const { isOpen } = useSidebarStore();

  return (
    <Button className='h-9 w-full' variant='ghost'>
      <Link
        href={href}
        className={cn(
          'flex w-full flex-row items-center gap-2 font-semibold',
          pathname === href ? 'text-[#01A261]' : 'text-neutral-700'
        )}
      >
        <Icon size={18} strokeWidth={2.5} />
        {isOpen ? name : null}
      </Link>
    </Button>
  );
};

export const Sidebar = () => {
  const { isOpen, toggle } = useSidebarStore();
  return (
    <div
      className={cn(
        'sticky left-0 top-[6dvh] flex h-[94dvh] flex-col items-start px-3 py-4',
        isOpen ? 'w-full max-w-[16rem]' : ''
      )}
    >
      <div className='flex w-full flex-row items-center justify-between py-3 text-sm font-semibold uppercase text-neutral-600'>
        {isOpen ? <div className='px-4'>Menu</div> : null}
        <Button
          className='flex flex-row items-center gap-2'
          variant='ghost'
          onClick={toggle}
        >
          {isOpen ? (
            <PanelLeftClose size={18} strokeWidth={2.5} />
          ) : (
            <PanelLeftOpen size={18} strokeWidth={2.5} />
          )}
        </Button>
      </div>

      {sidebarItems.map((item) => (
        <SidebarItem key={item.href} {...item} />
      ))}
    </div>
  );
};
