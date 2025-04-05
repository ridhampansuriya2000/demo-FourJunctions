"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import MovieForm from "@/components/movie-form"
import { Toaster } from "@/components/ui/toaster"
import { Film } from "lucide-react"
import ProtectedRoute from "@/components/protected-route";

export default function AddMoviePage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (movieData) => {
        setIsSubmitting(true)
        try {
            const response = await fetch("/api/movies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(movieData),
            })

            if (!response.ok) {
                throw new Error("Failed to add movie")
            }

            toast({
                title: "Success",
                description: "Movie added successfully",
                variant: "success",
            })

            router.push("/")
            router.refresh()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add movie",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <ProtectedRoute>
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8 flex items-center justify-center">
                <Film className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Add New Movie
                </h1>
            </div>
            <MovieForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            <Toaster />
        </div>
        </ProtectedRoute>
    )
}