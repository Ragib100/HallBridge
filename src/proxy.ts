import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const session = request.cookies.get("hb_session")?.value;
    const userRoute = request.cookies.get("hb_route")?.value;
    // Public routes that don't require authentication
    const publicRoutes = [
        "/auth/login",
        "/auth/register",
        "/auth/forgot-password",
        "/auth/reset-password",
        "/auth/verify-otp",
    ];

    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

    // If accessing a dashboard route without authentication, redirect to login
    if (pathname.startsWith("/dashboard") && !session) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // If accessing auth pages while authenticated, redirect to appropriate dashboard
    if (isPublicRoute && session && userRoute) {
        if (userRoute === "admin") {
            return NextResponse.redirect(new URL("/dashboard/admin", request.url));
        } else if (userRoute === "student") {
            return NextResponse.redirect(new URL("/dashboard/student/home", request.url));
        } else if (userRoute === "staff") {
            return NextResponse.redirect(new URL("/dashboard/staff/home", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc.)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|images|logos).*)",
    ],
};
