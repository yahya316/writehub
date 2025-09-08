import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Content from "@/models/Content";
import Category from "@/models/Category";
import Comment from "@/models/Comment";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const regex = new RegExp(q, "i");

    const [users, stories, categories, comments] = await Promise.all([
      User.find({ name: regex }).select("name").limit(5),
      Content.find({
        title: regex,
        visibility: "public",
        isDraft: false,
        publishDate: { $lte: new Date() },
      }).select("title slug").limit(5),
      Category.find({ name: regex }).select("name").limit(5),
      Comment.find({ text: regex }).select("text").limit(5),
    ]);

    const results = [
      ...users.map((u) => ({
        type: "User",
        title: u.name,
        href: '/profile/', 
      })),
      ...stories.map((s) => ({
        type: "Story",
        title: s.title,
        href: `/story/${s.slug}`,
      })),
      ...categories.map((c) => ({
        type: "Category",
        title: c.name,
        href: `/category/${c._id}`,
      })),
      ...comments.map((c) => ({
        type: "Comment",
        title: c.text.slice(0, 50) + (c.text.length > 50 ? "..." : ""),
        href: `/comments/${c._id}`,
      })),
    ];

    return NextResponse.json({ results });
  } catch (err) {
    console.error("Search API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}