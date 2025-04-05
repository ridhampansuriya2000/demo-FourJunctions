import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export const fetchProducers = createAsyncThunk("producers/fetchProducers", async () => {
    const response = await fetch("/api/producers")
    if (!response.ok) {
        throw new Error("Failed to fetch producers")
    }
    return response.json()
})

const initialState = {
    producers: [],
    loading: false,
    error: null,
}

const producerSlice = createSlice({
    name: "producers",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducers.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProducers.fulfilled, (state, action) => {
                state.loading = false
                state.producers = action.payload
            })
            .addCase(fetchProducers.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || "Failed to fetch producers"
            })
    },
})

export default producerSlice.reducer