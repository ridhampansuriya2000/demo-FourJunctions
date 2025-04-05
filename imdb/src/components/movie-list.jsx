"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { fetchMovies, deleteMovie } from "@/redux/features/movieSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, Film, User, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import MovieImage from "@/components/movie-image";

export default function MovieList() {
    const dispatch = useDispatch()
    const { movies, loading, error } = useSelector((state) => state.movies)
    const { toast } = useToast()
    const router = useRouter()

    useEffect(() => {
        dispatch(fetchMovies())
    }, [dispatch])

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this movie?")) {
            try {
                await dispatch(deleteMovie(id)).unwrap()
                toast({
                    title: "Success",
                    description: "Movie deleted successfully",
                    variant: "success",
                    position: "top-right",
                })
                router.refresh()
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to delete movie",
                    variant: "destructive",
                })
            }
        }
    }

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                    <Card key={index} className="overflow-hidden border-gray-50">
                        <Skeleton className="h-[200px] w-full" />
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Skeleton className="h-10 w-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Movies</h2>
                <Link href="/add-movie">
                    <Button className="bg-blue-600 hover:bg-blue-700 transition-colors text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add Movie
                    </Button>
                </Link>
            </div>

            {movies.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                    <Film className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-muted-foreground mb-4">No movies found</p>
                    <Link href="/add-movie">
                        <Button className="bg-blue-600 hover:bg-blue-700 transition-colors text-white cursor-pointer">
                            <Plus className="mr-2 h-4 w-4" /> Add Your First Movie
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {movies.map((movie) => (
                        <Card
                            key={movie._id}
                            className="overflow-hidden flex flex-col border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div className="relative h-[200px] w-full bg-gray-100">
                                <MovieImage
                                    key={movie.id}
                                    src={movie.poster}
                                    alt={movie.name + "Image"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                                <CardTitle className="flex justify-between items-start">
                                    <span className="text-blue-800 font-bold truncate">{movie.name}</span>
                                    <Badge className="bg-blue-600 text-white">{movie.year}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow pt-4">
                                <div className="mb-4">
                                    <div className="flex items-center text-sm font-medium mb-1 text-gray-700">
                                        <User className="h-4 w-4 mr-1 text-blue-600" /> Producer:
                                    </div>
                                    <p className="text-sm text-blue-700 font-medium">{movie.producer?.name || "Unknown"}</p>
                                </div>
                                <div>
                                    <div className="flex items-center text-sm font-medium mb-1 text-gray-700">
                                        <Users className="h-4 w-4 mr-1 text-blue-600" /> Actors:
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {movie.actors && movie.actors.length > 0 ? (
                                            movie.actors.map((actor) => (
                                                <Badge
                                                    key={actor._id}
                                                    variant="outline"
                                                    className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                                >
                                                    {actor.name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No actors listed</p>
                                        )}
                                    </div>
                                </div>
                                {movie.plot && (
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <p className="text-xs text-gray-600 line-clamp-2">{movie.plot}</p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="pt-6 flex justify-between items-center bg-gray-50 border-t border-gray-100">
                                <Link href={`/edit-movie/${movie._id}`}>
                                    <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                                        <Pencil className="h-4 w-4 mr-2" /> Edit
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(movie._id)}
                                    className="bg-red-600 hover:bg-red-700 transition-colors text-white"
                                >
                                    <Trash2 className="h-4 w-4 mr-2 text-white" /> Delete
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}