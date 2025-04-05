import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request, { params }) {
    try {
        const { db } = await connectToDatabase()
        const id = new ObjectId(params.id)

        const movie = await db
            .collection("movies")
            .aggregate([
                {
                    $match: { _id: id },
                },
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
            ])
            .toArray()

        if (!movie[0]) {
            return NextResponse.json({ error: "Movie not found" }, { status: 404 })
        }

        return NextResponse.json(movie[0])
    } catch (error) {
        console.error("Error fetching movie:", error)
        return NextResponse.json({ error: "Failed to fetch movie" }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    try {
        const { db } = await connectToDatabase()
        const id = new ObjectId(params.id)
        const data = await request.json()

        // Convert string IDs to ObjectIds
        const producer = new ObjectId(data.producer)
        const actors = data.actors.map((id) => new ObjectId(id))

        const result = await db.collection("movies").updateOne(
            { _id: id },
            {
                $set: {
                    name: data.name,
                    year: Number.parseInt(data.year),
                    plot: data.plot,
                    poster: data.poster || "",
                    producer,
                    actors,
                    updatedAt: new Date(),
                },
            },
        )

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Movie not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error updating movie:", error)
        return NextResponse.json({ error: "Failed to update movie" }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    try {
        const { db } = await connectToDatabase()
        const id = new ObjectId(params.id)

        const result = await db.collection("movies").deleteOne({ _id: id })

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Movie not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting movie:", error)
        return NextResponse.json({ error: "Failed to delete movie" }, { status: 500 })
    }
}