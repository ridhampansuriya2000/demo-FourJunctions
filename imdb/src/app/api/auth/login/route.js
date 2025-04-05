import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { signJWT } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function POST(request) {
    try {
        console.time("Login function");

        console.time("DB connection");
        const { db } = await connectToDatabase();
        console.timeEnd("DB connection");
        const { email, password } = await request.json()

        console.time("DB query");
        const user = await db.collection("users").findOne({ email });
        console.timeEnd("DB query");

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        console.time("Password validation");
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.timeEnd("Password validation");

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        console.time("JWT sign");
        const token = await signJWT({
            id: user._id,
            email: user.email,
            name: user.name,
        })
        console.timeEnd("JWT sign");

        const response = NextResponse.json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        })

        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 60 * 60 * 24,
        })

        console.timeEnd("Login function");
        return response
    } catch (error) {
        console.error("Error on Login:", error)
        return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
    }
}

