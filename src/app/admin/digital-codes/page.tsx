import { redirect } from 'next/navigation'
import { getAdminSession } from '@lib/admin-auth'
import { getAdminDigitalCodes, getDigitalProductVariants } from '../actions'
import { DigitalCodesClient } from './digital-codes-client'

export const metadata = {
  title: 'Digital Codes Vault | ReiKai Arcade Admin',
  description: 'Manage digital voucher codes for PSN Top-Up & Gift Cards',
}

export default async function AdminDigitalCodesPage() {
  const session = await getAdminSession()
  if (!session?.user) redirect('/sign-in')

  const [variants, codes] = await Promise.all([
    getDigitalProductVariants(),
    getAdminDigitalCodes(),
  ])

  return <DigitalCodesClient variants={variants} codes={codes} />
}
