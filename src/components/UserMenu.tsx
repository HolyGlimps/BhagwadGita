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
      <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
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
          className="relative h-10 w-10 rounded-full hover:shadow-lg transition-all duration-200 hover:scale-105 outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
          title={session.user.name || session.user.email}
        >
          <Avatar size="default" className="h-10 w-10">
            <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
            <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>

        {openMenu && (
          <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl bg-white dark:bg-slate-950 border border-gray-200 dark:border-gray-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {session.user.name || session.user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {session.user.email}
              </p>
            </div>

            <div className="">
              <Link
                href="/me"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-800/50 transition-colors"
                onClick={() => setOpenMenu(false)}
              >
                <Settings className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Profile Settings</span>
              </Link>

              <div className="h-px bg-gray-200 dark:bg-gray-800"></div>

              <button
                onClick={() => {
                  signOut();
                  setOpenMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
      className="px-4 py-2 text-sm font-semibold text-white bg-amber-600 dark:bg-amber-700 hover:bg-amber-700 dark:hover:bg-amber-600 transition-all duration-200 rounded-lg shadow-sm hover:shadow-md"
    >
      Sign In
    </button>
  );
}
