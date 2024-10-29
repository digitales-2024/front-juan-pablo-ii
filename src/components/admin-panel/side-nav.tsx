"use client"; // Ensure client-side rendering

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import logoJuanPablo from "@/app/favicon.ico";
import { SIDENAV_ITEMS } from '@/utils/constants';
import { SideNavItem } from '@/types';
import { LogoutDialog } from '../user/LogoutDialog';
import Image from 'next/image'

const SideNav = () => {
  return (
    <div className="md:w-60 bg-white h-screen flex-1 fixed border-r border-zinc-200 hidden md:flex">
      <div className="flex flex-col h-full">
        <Link
          href="/"
          className="flex items-center justify-center md:justify-start md:px-6 border-b border-zinc-200 h-16 w-full"
        >
          <Image
            src={logoJuanPablo}
            alt="Logo Juan Pablo"
            width={100}
            height={80}
            priority
          />
        </Link>

        <nav className="flex-grow flex flex-col justify-between py-6">
          <div className="flex flex-col space-y-2 px-6">
            {SIDENAV_ITEMS.map((item, idx) => (
              <MenuItem key={idx} item={item} />
            ))}
          </div>

          <div className="px-6 mt-auto">
            <LogoutDialog />
          </div>
        </nav>
      </div>
    </div>
  );
};

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => setSubMenuOpen(!subMenuOpen);

  const isActive = item.path === pathname || pathname.includes(item.path);

  return (
    <div>
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors ${
              isActive ? 'bg-zinc-100' : 'hover:bg-zinc-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              {item.icon}
              <span className="font-medium text-sm">{item.title}</span>
            </div>
            <Icon
              icon="lucide:chevron-down"
              className={`w-4 h-4 transition-transform ${subMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {subMenuOpen && (
            <div className="mt-2 ml-6 space-y-2">
              {item.subMenuItems?.map((subItem, idx) => (
                <Link
                  key={idx}
                  href={subItem.path}
                  className={`block p-2 rounded-lg text-sm ${
                    subItem.path === pathname
                      ? 'font-medium text-primary'
                      : 'text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  {subItem.title}
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
            isActive ? 'bg-zinc-100' : 'hover:bg-zinc-50'
          }`}
        >
          {item.icon}
          <span className="font-medium text-sm">{item.title}</span>
        </Link>
      )}
    </div>
  );
};

export default SideNav;