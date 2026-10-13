import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getAdminSession } from '@lib/admin-auth'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession()
  if (!session?.user) {
    redirect('/sign-in')
  }

  return <>{children}</>
}
