import React from 'react';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export function Header() {
  const location = useLocation();
  const title = location.pathname === '/' ? 'Dashboard' : 'Settings';

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        </div>
      </div>
    </div>
  );
}