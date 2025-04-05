import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
    try {
        const { db } = await connectToDatabase()

        const actors = await db.collection("actors").find({}).sort({ name: 1 }).toArray()

        return NextResponse.json(actors)
    } catch (error) {
        console.error("Error On fetching actors:", error)
        return NextResponse.json({ error: "Failed to fetch actors" }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        const { db } = await connectToDatabase()
        const data = await request.json()

        const result = await db.collection("actors").insertOne({
            name: data.name,
            gender: data.gender,
            dob: new Date(data.dob),
            bio: data.bio,
            createdAt: new Date(),
        })

        return NextResponse.json({ id: result.insertedId }, { status: 201 })
    } catch (error) {
        console.error("Error On creating actor:", error)
        return NextResponse.json({ error: "Failed to create actor" }, { status: 500 })
    }
}