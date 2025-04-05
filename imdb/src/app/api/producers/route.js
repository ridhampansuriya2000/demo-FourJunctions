import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
    try {
        const { db } = await connectToDatabase()

        const producers = await db.collection("producers").find({}).sort({ name: 1 }).toArray()

        return NextResponse.json(producers)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch producers" }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        const { db } = await connectToDatabase()
        const data = await request.json()

        const result = await db.collection("producers").insertOne({
            name: data.name,
            gender: data.gender,
            dob: new Date(data.dob),
            bio: data.bio,
            createdAt: new Date(),
        })

        return NextResponse.json({ id: result.insertedId }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: "Failed to create producer" }, { status: 500 })
    }
}