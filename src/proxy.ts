import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const session = request.cookies.get("hb_session")?.value;

    // Public routes that don't require authentication
    const publicRoutes = [
        "/auth/login",
        "/auth/register",
        "/auth/forgot-password",
        "/auth/change-password",
    ];

    // Check if the current path is a public route
    const isPublicRoute = 
        pathname === "/" ||
        publicRoutes.some((route) => pathname.startsWith(route)) ||
        pathname === "/unauthorized";

    // If no session and not a public route, redirect to login
    if (!session && !isPublicRoute) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // If has session and trying to access public auth routes, redirect to appropriate dashboard
    if (session && (pathname === "/" || pathname.startsWith("/auth/"))) {
        try {
            // Fetch user data to determine redirect location
            const userResponse = await fetch(new URL("/api/auth/me", request.url), {
                headers: {
                    Cookie: `hb_session=${session}`,
                },
            });

            if (userResponse.ok) {
                const { user } = await userResponse.json();
                
                // Redirect based on user type
                if (user.userType === "admin") {
                    return NextResponse.redirect(new URL("/dashboard/admin", request.url));
                } else if (user.userType === "staff") {
                    return NextResponse.redirect(new URL("/dashboard/staff/home", request.url));
                } else if (user.userType === "student") {
                    return NextResponse.redirect(new URL("/dashboard/student/home", request.url));
                }
            }
        } catch (error) {
            console.error("Error fetching user data in middleware:", error);
        }
    }

    // Role-based route protection
    if (session && !isPublicRoute) {
        try {
            // Fetch user data to validate role-based access
            const userResponse = await fetch(new URL("/api/auth/me", request.url), {
                headers: {
                    Cookie: `hb_session=${session}`,
                },
            });

            if (!userResponse.ok) {
                // Invalid session, redirect to login
                const response = NextResponse.redirect(new URL("/auth/login", request.url));
                response.cookies.delete("hb_session");
                return response;
            }

            const { user } = await userResponse.json();

            // Check role-based access
            if (pathname.startsWith("/dashboard/admin") && user.userType !== "admin") {
                return NextResponse.redirect(new URL("/unauthorized", request.url));
            }

            if (pathname.startsWith("/dashboard/staff") && user.userType !== "staff") {
                return NextResponse.redirect(new URL("/unauthorized", request.url));
            }

            if (pathname.startsWith("/dashboard/student") && user.userType !== "student") {
                return NextResponse.redirect(new URL("/unauthorized", request.url));
            }

        } catch (error) {
            console.error("Error validating user role in middleware:", error);
            // On error, redirect to login for safety
            const response = NextResponse.redirect(new URL("/auth/login", request.url));
            response.cookies.delete("hb_session");
            return response;
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
