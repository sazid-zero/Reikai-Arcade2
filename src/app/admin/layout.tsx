import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getAdminSession } from '@lib/admin-auth'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''

  // If on admin sign-in page, allow rendering
  if (pathname.includes('/admin/sign-in') || pathname.includes('/admin/login')) {
    return <>{children}</>
  }

  const session = await getAdminSession()
  if (!session?.user) {
    redirect('/admin/sign-in')
  }

  return <>{children}</>
}
