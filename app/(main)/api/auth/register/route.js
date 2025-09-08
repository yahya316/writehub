// app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  await dbConnect();

  try {
    const { name, email, password } = await req.json();
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user', 
    });

    return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}