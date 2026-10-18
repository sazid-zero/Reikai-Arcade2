'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, Shield, User, ChevronDown, Key, ShoppingBag, Heart } from 'lucide-react'

export interface AuthUser {
  id: string
  email: string
  phone?: string | null
  name: string
  role: string
}

export function UserAuthButton({ compact }: { compact?: boolean } = {}) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/sign-out', { method: 'POST' })
      setUser(null)
      setDropdownOpen(false)
      router.refresh()
    } catch (e) {
      console.error('Logout error:', e)
    }
  }

  if (loading) {
    if (compact) {
      return <div className="h-5 w-5 rounded-full bg-white/10 animate-pulse" />
    }
    return (
      <div className="h-8 w-20 animate-pulse rounded-full bg-white/5" />
    )
  }

  if (!user) {
    if (compact) {
      return (
        <Link
          href="/sign-in"
          className="flex items-center justify-center text-inherit hover:text-white transition"
          aria-label="Sign In"
          data-testid="bottom-nav-signin"
        >
          <User size={19} />
        </Link>
      )
    }

    return (
      <div className="flex items-center gap-2">
        <Link
          href="/sign-in"
          className="header-signin-btn inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 font-['DM_Mono'] text-xs font-bold text-white transition-all duration-200 hover:border-white/25 hover:bg-white/[0.08] hover:shadow-lg active:scale-95"
          data-testid="header-sign-in"
        >
          <User size={13} className="text-white/60" />
          <span>SIGN IN</span>
        </Link>
      </div>
    )
  }

  const initials = (user.name || user.email || 'U').slice(0, 2).toUpperCase()
  const displayIdentifier = user.phone || (user.email.includes('@phone.reikai.arcade') ? user.email.replace('@phone.reikai.arcade', '') : user.email)
  const isAdmin = user.role === 'admin'

  // Dropdown menu content
  const dropdownContent = (
    <>
      <div className="border-b border-white/10 px-3 py-2.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-white truncate">{user.name || 'Player'}</p>
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/80 border border-white/15">
            {isAdmin ? 'ADMIN' : 'MEMBER'}
          </span>
        </div>
        <p className="font-mono text-[10px] text-zinc-400 truncate mt-0.5">{displayIdentifier}</p>
      </div>

      <div className="py-1">
        {/* User links */}
        <Link
          href="/orders"
          onClick={() => setDropdownOpen(false)}
          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/10 hover:text-white transition"
        >
          <ShoppingBag size={14} className="text-white/60" />
          <span>My Orders</span>
        </Link>
        <Link
          href="/wishlist"
          onClick={() => setDropdownOpen(false)}
          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/10 hover:text-white transition"
        >
          <Heart size={14} className="text-white/60" />
          <span>Wishlist</span>
        </Link>

        {/* Admin only links */}
        {isAdmin && (
          <>
            <div className="my-1 border-t border-white/5" />
            <Link
              href="/admin"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/10 hover:text-white transition"
            >
              <Shield size={14} className="text-white/60" />
              <span>Admin Control Room</span>
            </Link>
            <Link
              href="/admin/orders"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/10 hover:text-white transition"
            >
              <Key size={14} className="text-white/60" />
              <span>Manage Orders</span>
            </Link>
          </>
        )}
      </div>

      <div className="border-t border-white/10 pt-1">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-400 hover:bg-white/5 hover:text-white transition cursor-pointer"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  )

  if (compact) {
    return (
      <div className="relative flex items-center justify-center" ref={menuRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center justify-center cursor-pointer"
          aria-label="User profile menu"
          data-testid="bottom-nav-user-profile"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[9px] font-bold text-black shadow-sm">
            {initials}
          </div>
        </button>

        {dropdownOpen && (
          <div className="fixed bottom-[70px] right-3 w-56 rounded-2xl border border-white/10 bg-zinc-950/98 p-2 shadow-2xl backdrop-blur-2xl z-[300] animate-in fade-in slide-in-from-bottom-2 duration-150">
            {dropdownContent}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] p-1 pr-2.5 transition-all hover:border-white/30 hover:bg-white/[0.08] cursor-pointer"
        aria-label="User profile menu"
        data-testid="header-user-profile"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[11px] font-bold text-black shadow-md">
          {initials}
        </div>
        <span className="hidden sm:inline font-['DM_Mono'] text-[11px] font-bold text-zinc-200 max-w-[120px] truncate">
          {user.name || 'Player'}
        </span>
        <ChevronDown size={12} className="text-white/40" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-white/10 bg-zinc-950/98 p-2 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          {dropdownContent}
        </div>
      )}
    </div>
  )
}
