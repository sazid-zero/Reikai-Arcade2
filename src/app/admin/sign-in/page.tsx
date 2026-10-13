import { redirect } from 'next/navigation'
import { getAdminSession } from '@lib/admin-auth'
import { AdminSignInForm } from '@/components/admin-auth-form'

export const metadata = {
  title: 'Admin Sign In | ReiKai Arcade',
  description: 'Administrative access for ReiKai Arcade operations',
}

export default async function AdminSignInPage() {
  const session = await getAdminSession()
  if (session?.user) {
    redirect('/admin')
  }

  return <AdminSignInForm />
}
