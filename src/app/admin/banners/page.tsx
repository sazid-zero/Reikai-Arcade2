import { redirect } from 'next/navigation';
import { getAdminSession } from '@lib/admin-auth';
import { BannersClient } from './banners-client';

export const metadata = {
  title: 'Banner Carousel Manager | ReiKai Arcade Admin',
  description: 'Manage homepage showcase banners and carousel slides',
};

export default async function AdminBannersPage() {
  const session = await getAdminSession();
  if (!session?.user) redirect('/admin/sign-in');

  return <BannersClient />;
}
