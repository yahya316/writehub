// app/api/contact/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Message from '@/models/Message';

export async function POST(req) {
  await dbConnect();
  try {
    const { name, email, message } = await req.json();
    const newMessage = await Message.create({ name, email, message });
    return NextResponse.json({ message: 'Message sent successfully!', data: newMessage }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}