'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, Shield, User, ChevronDown, Key, ShoppingBag, Heart, Gamepad2 } from 'lucide-react'

export interface AuthUser {
  id: string
  email: string
  phone?: string | null
  name: string
  role: string
}

export function UserAuthButton() {
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
    return (
      <div className="h-8 w-20 animate-pulse rounded-full bg-white/5" />
    )
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/sign-in"
          className="header-signin-btn inline-flex items-center gap-2 rounded-full border border-[#a0e4f1]/40 bg-[#a0e4f1]/10 px-3.5 py-1.5 font-['DM_Mono'] text-xs font-bold text-white transition-all duration-200 hover:border-[#a0e4f1] hover:bg-[#a0e4f1]/20 hover:shadow-[0_0_18px_rgba(160,228,241,0.4)] active:scale-95"
          data-testid="header-sign-in"
        >
          <User size={13} className="text-[#a0e4f1]" />
          <span>SIGN IN</span>
        </Link>
      </div>
    )
  }

  const initials = (user.name || user.email || 'U').slice(0, 2).toUpperCase()
  const displayIdentifier = user.phone || (user.email.includes('@phone.reikai.arcade') ? user.email.replace('@phone.reikai.arcade', '') : user.email)
  const isAdmin = user.role === 'admin'

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-[#a0e4f1]/50 bg-black/40 p-1 pr-2.5 transition-all hover:border-[#a0e4f1] hover:shadow-[0_0_20px_rgba(160,228,241,0.35)] cursor-pointer"
        aria-label="User profile menu"
        data-testid="header-user-profile"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#c673e2] to-[#a0e4f1] text-[11px] font-black text-white shadow-[0_0_10px_rgba(160,228,241,0.5)]">
          {initials}
        </div>
        <span className="hidden sm:inline font-['DM_Mono'] text-[11px] font-bold text-zinc-200 max-w-[120px] truncate">
          {user.name || 'Player'}
        </span>
        <ChevronDown size={12} className="text-[#a0e4f1]" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-[#c673e2]/30 bg-[#050505]/95 p-2 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="border-b border-white/10 px-3 py-2.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-white truncate">{user.name || 'Player'}</p>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                isAdmin ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-[#a0e4f1]/20 text-[#a0e4f1] border border-[#a0e4f1]/30'
              }`}>
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
              <ShoppingBag size={14} className="text-[#a0e4f1]" />
              <span>My Orders</span>
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/10 hover:text-white transition"
            >
              <Heart size={14} className="text-pink-400" />
              <span>Wishlist</span>
            </Link>

            {/* Admin only links */}
            {isAdmin && (
              <>
                <div className="my-1 border-t border-white/5" />
                <Link
                  href="/admin"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/10 transition"
                >
                  <Shield size={14} className="text-amber-400" />
                  <span>Admin Control Room</span>
                </Link>
                <Link
                  href="/admin/orders"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/10 transition"
                >
                  <Key size={14} className="text-amber-400" />
                  <span>Manage Orders</span>
                </Link>
              </>
            )}
          </div>

          <div className="border-t border-white/10 pt-1">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
