// app/sitemap.xml/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Content from '@/models/Content';

export const dynamic = "force-dynamic";

export async function GET() {
  await dbConnect();

  try {
    const stories = await Content.find({
      isDraft: false,
      visibility: 'public',
      publishDate: { $lte: new Date() },
    }, 'slug updatedAt').sort({ updatedAt: -1 });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://localhost:3000/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://localhost:3000/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  ${stories
    .map((story) => {
      return `
    <url>
      <loc>https://localhost:3000/story/${story.slug}</loc>
      <lastmod>${story.updatedAt ? story.updatedAt.toISOString() : new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `;
    })
    .join('')}
</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Failed to generate sitemap:', error);
    return NextResponse.json({ error: 'Failed to generate sitemap' }, { status: 500 });
  }
}