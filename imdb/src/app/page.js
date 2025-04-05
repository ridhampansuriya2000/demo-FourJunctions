import MovieList from "@/components/movie-list"
import { Toaster } from "@/components/ui/toaster"
import ProtectedRoute from "@/components/protected-route";

export default function Home() {
    return (
        <div className="container mx-auto py-8 px-4">
            <ProtectedRoute/>
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    IMDB
                </h1>
                <p className="text-gray-600">Your personal movie collection manager</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <MovieList />
            </div>
            <Toaster />
        </div>
    )
}