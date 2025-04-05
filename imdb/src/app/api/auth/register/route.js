import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(request) {
    try {
        const { db } = await connectToDatabase()
        const { name, email, password } = await request.json()

        const existingUser = await db.collection("users").findOne({ email })

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const result = await db.collection("users").insertOne({
            name,
            email,
            password: hashedPassword,
            createdAt: new Date(),
        })

        return NextResponse.json(
            {
                id: result.insertedId,
                name,
                email,
            },
            { status: 201 },
        )
    } catch (error) {
        console.error("Error on Registration error:", error)
        return NextResponse.json({ error: "Registration failed" }, { status: 500 })
    }
}