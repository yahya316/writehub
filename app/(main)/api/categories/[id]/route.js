// app/api/categories/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';

export async function GET(req, { params }) {
  await dbConnect();
  try {
    const { id } = params;

    const stories = await Content.find({
      category: id,
      visibility: 'public',
      publishDate: { $lte: new Date() },
      isDraft: false,
    })
      .sort({ createdAt: -1 })
      .populate('category', 'name')
      .populate('author', 'name');

    return NextResponse.json({ stories }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
}


export async function PUT(req, { params }) {
  await dbConnect();
  try {
    const { id } = await params; 
    const { name } = await req.json();
    const updatedCategory = await Category.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ category: updatedCategory }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();
  try {
    const { id } = await params; 
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}