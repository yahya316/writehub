import { getServerSession } from "next-auth";
import { authOptions } from "@/app/(main)/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import User from "@/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  await dbConnect();

  const commentCount = await Comment.countDocuments({ author: session.user.id });
  const user = await User.findById(session.user.id).lean();
  const favoriteCount = user?.favorites?.length || 0;

  return new Response(
    JSON.stringify({ commentCount, favoriteCount }),
    { status: 200 }
  );
}
