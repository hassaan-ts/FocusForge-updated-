import React from 'react';
import { NavLink } from 'react-router-dom';
import { Focus, Settings, Timer, ListTodo } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Sidebar() {
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Focus },
    { name: 'Habits', href: '/habits', icon: ListTodo },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <img src="/logo.svg" alt="FocusForge" className="h-8 w-8" />
          <span className="ml-2 text-xl font-semibold">FocusForge</span>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                          isActive
                            ? 'bg-gray-50 text-indigo-600'
                            : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                        }`
                      }
                    >
                      <item.icon className="h-6 w-6 shrink-0" />
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
            {user && (
              <li className="mt-auto">
                <div className="flex items-center gap-x-4 py-3 text-sm font-semibold leading-6 text-gray-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
                    {user.username[0].toUpperCase()}
                  </span>
                  <span className="sr-only">Your profile</span>
                  <span aria-hidden="true">{user.username}</span>
                </div>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}