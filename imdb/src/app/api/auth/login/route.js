import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { signJWT } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function POST(request) {
    try {
        const { db } = await connectToDatabase()
        const { email, password } = await request.json()

        const user = await db.collection("users").findOne({ email })

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        const token = await signJWT({
            id: user._id,
            email: user.email,
            name: user.name,
        })

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

        return response
    } catch (error) {
        console.error("Error on Login:", error)
        return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
    }
}

