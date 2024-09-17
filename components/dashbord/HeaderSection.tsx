// File: components/Header.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { HamburgerMenuIcon, GearIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
          >
            <HamburgerMenuIcon className="h-6 w-6" />
            <span className="sr-only">Menu</span>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="min-w-[200px] bg-white rounded-md shadow-md p-2">
          <DropdownMenu.Item className="px-2 py-1 outline-none cursor-pointer hover:bg-gray-100">
            Option 1
          </DropdownMenu.Item>
          <DropdownMenu.Item className="px-2 py-1 outline-none cursor-pointer hover:bg-gray-100">
            Option 2
          </DropdownMenu.Item>
          {/* Add more menu items as needed */}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      
      <h1
        className={cn(
          "text-2xl md:text-3xl font-bold text-gray-800 flex-grow text-center",
          font.className
        )}
      >
        {title}
      </h1>
      
      <Link href="/settings" passHref>
        <Button
          variant="ghost"
          size="icon"
          className="focus:outline-none"
        >
          <GearIcon className="h-6 w-6" />
          <span className="sr-only">Settings</span>
        </Button>
      </Link>
    </header>
  );
}