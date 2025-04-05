import { configureStore } from "@reduxjs/toolkit"
import movieReducer from "./features/movieSlice"
import actorReducer from "./features/actorSlice"
import producerReducer from "./features/producerSlice"
import authReducer from "./features/authSlice"

export const store = configureStore({
    reducer: {
        movies: movieReducer,
        actors: actorReducer,
        producers: producerReducer,
        auth: authReducer,
    },
})

