import DashboardLayout from '@/components/DashboardLayout';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/(main)/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function UserLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <DashboardLayout session={session}>
      {children}
    </DashboardLayout>
  );
}
