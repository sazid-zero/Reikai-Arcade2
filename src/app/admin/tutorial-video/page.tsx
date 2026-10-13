import { redirect } from 'next/navigation';
import { getAdminSession } from '@lib/admin-auth';
import { TutorialVideoClient } from './tutorial-video-client';

export const metadata = {
  title: 'Tutorial Video Manager | ReiKai Arcade Admin',
  description: 'Upload and configure the storefront tutorial video player',
};

export default async function AdminTutorialVideoPage() {
  const session = await getAdminSession();
  if (!session?.user) redirect('/admin/sign-in');

  return <TutorialVideoClient />;
}
