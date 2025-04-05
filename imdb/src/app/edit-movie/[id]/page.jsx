"use client"

import { useRouter } from "next/navigation"
import {use, useEffect, useState} from "react"
import { useToast } from "@/hooks/use-toast"
import MovieForm from "@/components/movie-form"
import { Toaster } from "@/components/ui/toaster"
import { Skeleton } from "@/components/ui/skeleton"
import { Pencil } from "lucide-react"
import ProtectedRoute from "@/components/protected-route";

export default function EditMoviePage({ params }) {
    const router = useRouter()
    const { toast } = useToast()
    const [movie, setMovie] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { id } = use(params)

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await fetch(`/api/movies/${id}`)
                if (!response.ok) {
                    throw new Error("Failed to fetch movie")
                }
                const data = await response.json()
                setMovie(data)
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch movie details",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchMovie()
    }, [id, toast])

    const handleSubmit = async (movieData) => {
        setIsSubmitting(true)
        try {
            const response = await fetch(`/api/movies/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(movieData),
            })

            if (!response.ok) {
                throw new Error("Failed to update movie")
            }

            toast({
                title: "Success",
                description: "Movie updated successfully",
                variant: "success",
            })

            router.push("/")
            router.refresh()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update movie",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="mb-8 flex items-center justify-center">
                    <Pencil className="h-8 w-8 text-blue-600 mr-3" />
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Edit Movie
                    </h1>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        )
    }

    return (
        <ProtectedRoute>
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8 flex items-center justify-center">
                <Pencil className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Edit Movie
                </h1>
            </div>
            {movie && <MovieForm onSubmit={handleSubmit} isSubmitting={isSubmitting} initialData={movie} />}
            <Toaster />
        </div>
        </ProtectedRoute>
    )
}