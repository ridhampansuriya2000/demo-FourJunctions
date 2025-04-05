import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
    try {
        const { db } = await connectToDatabase()

        const movies = await db
            .collection("movies")
            .aggregate([
                {
                    $lookup: {
                        from: "producers",
                        localField: "producer",
                        foreignField: "_id",
                        as: "producer",
                    },
                },
                {
                    $lookup: {
                        from: "actors",
                        localField: "actors",
                        foreignField: "_id",
                        as: "actors",
                    },
                },
                {
                    $unwind: {
                        path: "$producer",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $sort: { year: -1 },
                },
            ])
            .toArray()

        return NextResponse.json(movies)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        const { db } = await connectToDatabase()
        const data = await request.json()

        const producer = new ObjectId(data.producer)
        const actors = data.actors.map((id) => new ObjectId(id))

        const result = await db.collection("movies").insertOne({
            name: data.name,
            year: Number.parseInt(data.year),
            plot: data.plot,
            poster: data.poster || "",
            producer,
            actors,
            createdAt: new Date(),
        })

        return NextResponse.json({ id: result.insertedId }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: "Failed to create movie" }, { status: 500 })
    }
}