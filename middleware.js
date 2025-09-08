// middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl.clone();

  if (url.pathname === "/dashboard") {
    if (!token) {
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next(); 
  }

  if (url.pathname.startsWith("/admin") && (!token || token.role !== "admin")) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (url.pathname.startsWith("/user/dashboard") && !token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/user/dashboard/:path*"],
};
