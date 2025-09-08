// app/api/status/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';

export async function GET() {
  try {
    await dbConnect();

    const categoryCount = await Category.countDocuments({});

    return NextResponse.json({
      status: 'Database connected',
      categoryCollectionExists: true,
      categoryCount: categoryCount,
      message: 'Connection to MongoDB is successful.',
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      status: 'Database connection failed',
      error: error.message,
    }, { status: 500 });
  }
}


