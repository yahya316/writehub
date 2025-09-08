// app/api/categories/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';

export async function GET() {
  await dbConnect();

  try {
    const categories = await Category.find({});
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const { name } = await req.json();
    const newCategory = await Category.create({ name });
    return NextResponse.json({ category: newCategory }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}