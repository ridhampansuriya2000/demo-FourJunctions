import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export const loginUser = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        })

        const data = await response.json()

        if (!response.ok) {
            return rejectWithValue(data.error || "Login failed")
        }

        localStorage.setItem("user", JSON.stringify(data.user))

        return data.user
    } catch (error) {
        return rejectWithValue(error.message || "Login failed")
    }
})

export const registerUser = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })

        const data = await response.json()

        if (!response.ok) {
            return rejectWithValue(data.error || "Registration failed")
        }

        return data
    } catch (error) {
        return rejectWithValue(error.message || "Registration failed")
    }
})

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
        })

        if (!response.ok) {
            const data = await response.json()
            return rejectWithValue(data.error || "Logout failed")
        }

        localStorage.removeItem("user")

        return null
    } catch (error) {
        return rejectWithValue(error.message || "Logout failed")
    }
})

const getUserFromStorage = () => {
    if (typeof window !== "undefined") {
        const user = localStorage.getItem("user")
        return user ? JSON.parse(user) : null
    }
    return null
}

const initialState = {
    user: getUserFromStorage(),
    loading: false,
    error: null,
    registerSuccess: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        clearRegisterSuccess: (state) => {
            state.registerSuccess = false
        },
    },
    extraReducers: (builder) => {
        builder
            /** Login cases */
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || "Login failed"
            })
            /** Register cases */
            .addCase(registerUser.pending, (state) => {
                state.loading = true
                state.error = null
                state.registerSuccess = false
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false
                state.registerSuccess = true
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || "Registration failed"
            })
            /** Logout cases */
            .addCase(logoutUser.pending, (state) => {
                state.loading = true
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false
                state.user = null
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || "Logout failed"
            })
    },
})

export const { clearError, clearRegisterSuccess } = authSlice.actions

export default authSlice.reducer