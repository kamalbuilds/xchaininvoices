'use client';

import { usePathname } from 'next/navigation';


import Image from 'next/image';
import Link from 'next/link';

import React from 'react';

// import Logo from 'public/logo.svg';

import { Button } from '../ui/button';
import { ConnectButton } from './connect-button';

export const Navbar = () => {
  const pathname = usePathname();
  const isHome = pathname === '/';
  return (
    <div className='fixed top-0 h-[6dvh] w-full' style={{
      backgroundColor: isHome ? '#F1FDEF' : 'white',
    
    }}>
      <div className='mx-auto flex h-full items-center justify-between px-4 sm:px-8'>
        <Link className='flex flex-row items-center gap-2' href='/'>
          {/* <Image
            alt='XChainInvoices'
            height={32}
            src={Logo as unknown as string}
            width={32}
          /> */}
          <div className='text-2xl font-semibold'>XChainInvoices</div>
        </Link>
        <div className='flex flex-row items-center gap-2'>
          <Button
            asChild
            className='hidden p-0 px-2 text-base text-foreground sm:flex'
            variant='link'
          >
            <Link href='/dashboard'>Dashboard</Link>
          </Button>
          <Button
            asChild
            className='hidden p-0 px-2 text-base text-foreground sm:flex'
            variant='link'
          >
            <Link href='/dashboard/create-invoice'>Create Invoice</Link>
          </Button>
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};
