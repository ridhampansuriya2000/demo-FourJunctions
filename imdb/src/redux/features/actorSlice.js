import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export const fetchActors = createAsyncThunk("actors/fetchActors", async () => {
    const response = await fetch("/api/actors")
    if (!response.ok) {
        throw new Error("Failed to fetch actors")
    }
    const data = await response.json()
    console.log("Fetched actors:", data)
    return data
})

const initialState = {
    actors: [],
    loading: false,
    error: null,
}

const actorSlice = createSlice({
    name: "actors",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchActors.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchActors.fulfilled, (state, action) => {
                state.loading = false
                state.actors = action.payload
            })
            .addCase(fetchActors.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || "Failed to fetch actors"
            })
    },
})

export default actorSlice.reducer