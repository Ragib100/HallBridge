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
    ];

    const isPublicRoute =
        pathname === "/" ||
        pathname === "/unauthorized" ||
        publicRoutes.some((route) => pathname.startsWith(route));

    // ─────────────────────────────────────────────
    // 1. Not logged in → redirect to login
    // ─────────────────────────────────────────────
    if (!session && !isPublicRoute) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // ─────────────────────────────────────────────
    // 2. Logged in → validate session & user
    // ─────────────────────────────────────────────
    if (session) {
        try {
            const userResponse = await fetch(
                new URL("/api/auth/me", request.url),
                {
                    headers: {
                        Cookie: `hb_session=${session}`,
                    },
                }
            );

            // Invalid session
            if (!userResponse.ok) {
                const response = NextResponse.redirect(
                    new URL("/auth/login", request.url)
                );
                response.cookies.delete("hb_session");
                return response;
            }

            const { user } = await userResponse.json();

            // ─────────────────────────────────────────
            // 3. Force password change
            // ─────────────────────────────────────────
            if (
                user.mustChangePassword &&
                pathname !== "/auth/change-password"
            ) {
                return NextResponse.redirect(
                    new URL("/auth/change-password", request.url)
                );
            }

            // ─────────────────────────────────────────
            // 4. Explicit role-based dashboard redirect
            //    (THIS is the improved part)
            // ─────────────────────────────────────────
            if (
                !user.mustChangePassword &&
                (pathname === "/" ||
                    pathname === "/dashboard" ||
                    pathname.startsWith("/auth/"))
            ) {
                if (user.userType === "admin") {
                    return NextResponse.redirect(
                        new URL("/dashboard/admin", request.url)
                    );
                }

                if (user.userType === "staff") {
                    return NextResponse.redirect(
                        new URL("/dashboard/staff/home", request.url)
                    );
                }

                if (user.userType === "student") {
                    return NextResponse.redirect(
                        new URL("/dashboard/student/home", request.url)
                    );
                }
            }

            // ─────────────────────────────────────────
            // 5. Role-based access protection
            // ─────────────────────────────────────────
            if (pathname.startsWith("/dashboard")) {
                if (
                    pathname.startsWith("/dashboard/admin") &&
                    user.userType !== "admin"
                ) {
                    return NextResponse.redirect(
                        new URL("/unauthorized", request.url)
                    );
                }

                if (
                    pathname.startsWith("/dashboard/staff") &&
                    user.userType !== "staff"
                ) {
                    return NextResponse.redirect(
                        new URL("/unauthorized", request.url)
                    );
                }

                if (
                    pathname.startsWith("/dashboard/student") &&
                    user.userType !== "student"
                ) {
                    return NextResponse.redirect(
                        new URL("/unauthorized", request.url)
                    );
                }
            }
        } catch (error) {
            console.error("Middleware error:", error);
            const response = NextResponse.redirect(
                new URL("/auth/login", request.url)
            );
            response.cookies.delete("hb_session");
            return response;
        }
    }

    // ─────────────────────────────────────────────
    // 6. Allow request to continue
    // ─────────────────────────────────────────────
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
