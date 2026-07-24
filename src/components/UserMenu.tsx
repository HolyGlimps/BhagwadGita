'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback, Button } from '@/components/ui';
import { Settings, LogOut } from 'lucide-react';

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [openMenu, setOpenMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && event.target && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    }

    if (openMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openMenu]);

  if (status === 'loading' || !mounted) {
    return (
      <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-10 h-10 animate-pulse"></div>
    );
  }

  if (session?.user) {
    const initials = (session.user.name || session.user.email || 'U')
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <div className="relative" ref={menuRef}>
        <Button
          onClick={() => setOpenMenu(!openMenu)}
          className="relative hover:shadow-lg rounded-full outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 w-10 h-10 hover:scale-105 transition-all duration-200"
          title={session.user.name || session.user.email}
        >
          <Avatar size="default" className="w-10 h-10">
            <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
            <AvatarFallback className="bg-gradient-to-br from-amber-500 dark:from-amber-600 to-amber-600 dark:to-amber-700 font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>

        {openMenu && (
          <div className="right-0 z-50 absolute bg-background slide-in-from-top-2 shadow-xl mt-2 border border-gray-200 dark:border-gray-800 rounded-lg w-56 overflow-hidden animate-in duration-200 fade-in">
            {/* User Info */}
            <div className="px-4 py-3 border-gray-200 dark:border-gray-800 border-b">
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {session.user.name || session.user.email?.split('@')[0]}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-xs truncate">
                {session.user.email}
              </p>
            </div>

            <div className="">
              <Link
                href="/me"
                className="flex items-center gap-3 hover:bg-amber-50 dark:hover:bg-gray-800/50 px-4 py-2 text-gray-700 dark:text-gray-300 text-sm transition-colors"
                onClick={() => setOpenMenu(false)}
              >
                <Settings className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Profile Settings</span>
              </Link>

              <div className="bg-gray-200 dark:bg-gray-800 h-px"></div>

              <button
                onClick={() => {
                  signOut();
                  setOpenMenu(false);
                }}
                className="flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 w-full text-red-700 dark:text-red-400 text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('google')}
      className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 shadow-sm hover:shadow-md px-4 py-2 rounded-lg font-semibold text-white text-sm transition-all duration-200"
    >
      Sign In
    </button>
  );
}
