import { redirect } from 'next/navigation'
import { getCurrentUserSession } from '@lib/admin-auth'
import { UserAuthForm } from '@/components/user-auth-form'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Sign In | ReiKai Arcade',
  description: 'Sign in to your ReiKai Arcade vault account using email or mobile number',
}

export default async function SignInPage() {
  const user = await getCurrentUserSession()
  if (user) {
    if (user.role === 'admin') {
      redirect('/admin')
    } else {
      redirect('/')
    }
  }

  return <UserAuthForm initialMode="signin" />
}
