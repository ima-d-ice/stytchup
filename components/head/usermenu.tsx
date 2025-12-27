"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const UserIcon = () => <User className="text-2xl" />;

export default function UserMenu() {
  const { data: session, update } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const user = session?.user;
  
  if (!user) {
    return (
      <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
        Log in
      </Link>
    );
  }

  // 👇 HELPER: Normalize role to uppercase for checking
  // This handles if DB sends "CUSTOMER" or "customer"
  const userRole = user.role?.toUpperCase() || "CUSTOMER";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-full border-transparent"
      >
        <div className="w-6 h-6 text-gray-600 hover:text-yellow-500">
          <UserIcon />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-7 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
            {user.role && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                userRole === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {userRole}
              </span>
            )}
          </div>

          <ul className="py-1">
            {/* 👇 FIX: Check against 'CUSTOMER' (Uppercase) */}
            {userRole !== 'CUSTOMER' && (
              <li>
                <Link 
                  href="/dashboard" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
            )}
            <li>
              <Link 
                href="/account-settings" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                onClick={() => setIsOpen(false)}
              >
                Account Settings
              </Link>
            </li>
          </ul>

          <div className="border-t border-gray-100 py-1">
            <button 
            onClick={async () => {
                // 👇 FIX: Determine new role based on Uppercase check
                // Send lowercase to backend because your API expects 'designer'/'customer'
                const targetRole = userRole === 'CUSTOMER' ? 'designer' : 'customer';
                
                try {
                  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/change-role`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ role: targetRole }), 
                      credentials: 'include',
                  });

                  if (res.ok) {
                      // Update session with the new role (Upper case for UI consistency)
                      await update({ role: targetRole.toUpperCase() });
                      window.location.reload(); 
                  } else {
                      console.error("Failed to switch role");
                  }
                } catch (error) {
                  console.error("Network error:", error);
                }
            }}
            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
            {/* 👇 FIX: Button text logic */}
            Switch to {userRole === 'CUSTOMER' ? 'Designer' : 'Customer'}
            </button>
            <button
              onClick={() => signOut()}
              className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}