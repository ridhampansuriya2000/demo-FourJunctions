import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export const fetchMovies = createAsyncThunk("movies/fetchMovies", async () => {
    const response = await fetch("/api/movies")
    if (!response.ok) {
        throw new Error("Failed to fetch movies")
    }
    return response.json()
})

export const deleteMovie = createAsyncThunk("movies/deleteMovie", async (id) => {
    const response = await fetch(`/api/movies/${id}`, {
        method: "DELETE",
    })
    if (!response.ok) {
        throw new Error("Failed to delete movie")
    }
    return id
})

const initialState = {
    movies: [],
    loading: false,
    error: null,
}

const movieSlice = createSlice({
    name: "movies",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovies.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchMovies.fulfilled, (state, action) => {
                state.loading = false
                state.movies = action.payload
            })
            .addCase(fetchMovies.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || "Failed to fetch movies"
            })
            .addCase(deleteMovie.fulfilled, (state, action) => {
                state.movies = state.movies.filter((movie) => movie._id !== action.payload)
            })
    },
})

export default movieSlice.reducer