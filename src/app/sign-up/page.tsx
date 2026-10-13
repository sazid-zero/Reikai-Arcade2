import { redirect } from 'next/navigation'
import { getCurrentUserSession } from '@lib/admin-auth'
import { UserAuthForm } from '@/components/user-auth-form'

export const metadata = {
  title: 'Sign Up | ReiKai Arcade',
  description: 'Create your ReiKai Arcade vault account using email or mobile number',
}

export default async function SignUpPage() {
  const user = await getCurrentUserSession()
  if (user) {
    if (user.role === 'admin') {
      redirect('/admin')
    } else {
      redirect('/')
    }
  }

  return <UserAuthForm initialMode="signup" />
}
