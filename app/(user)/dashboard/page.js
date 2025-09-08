import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/(main)/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import Content from '@/models/Content';
import DashboardComponent from '@/components/DashboardComponent';
import User from '@/models/User';

async function getDashboardData(role, userId) {
    await dbConnect();

    if (role === 'admin') {
        const totalCategories = await Category.countDocuments({});
        const totalStories = await Content.countDocuments({});
        const publicStories = await Content.countDocuments({ visibility: 'public' });
        const privateStories = await Content.countDocuments({ visibility: 'private' });
        return { totalCategories, totalStories, publicStories, privateStories, userStories: [] };
    } else {
        const userStories = await Content.find({ author: userId }).sort({ createdAt: -1 }).limit(10).lean();
        return {
            totalCategories: 0, 
            totalStories: 0, 
            publicStories: 0, 
            privateStories: 0, 
            userStories: JSON.parse(JSON.stringify(userStories))
        };
    }
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/auth/login');
    }

    const { user } = session;
    const { totalCategories, totalStories, publicStories, privateStories, userStories } = await getDashboardData(user.role, user.id);

    return (
        <DashboardComponent
            session={session}
            adminStats={{ totalCategories, totalStories, publicStories, privateStories }}
            userStories={userStories}
        />
    );
}
