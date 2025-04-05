import { NextResponse } from "next/server"
import {verifyAuth} from "@/lib/auth";

export async function middleware(request) {
    const token = request.cookies.get("token")?.value

    const verifiedToken =
        token &&
        (await verifyAuth(token).catch((err) => {
            console.error(err.message)
        }))

    if (
        request.nextUrl.pathname.startsWith("/api") &&
        !request.nextUrl.pathname.startsWith("/api/auth") &&
        request.nextUrl.pathname !== "/api/movies"
    ) {
        if (!verifiedToken) {
            return new NextResponse(JSON.stringify({ error: "Authentication required" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            })
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/api/movies/:path*", "/api/actors/:path*", "/api/producers/:path*"],
}