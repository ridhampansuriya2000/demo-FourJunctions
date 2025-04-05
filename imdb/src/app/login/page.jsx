"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useDispatch, useSelector } from "react-redux"
import { loginUser, clearError } from "@/redux/features/authSlice"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, LogIn, AlertCircle } from "lucide-react"

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export default function LoginPage() {
    const dispatch = useDispatch()
    const router = useRouter()
    const { user, loading, error } = useSelector((state) => state.auth)
    const [showError, setShowError] = useState(false)

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    useEffect(() => {
        dispatch(clearError())

        if (user) {
            router.push("/")
        }
    }, [dispatch, user, router])

    useEffect(() => {
        if (error) {
            setShowError(true)
            const timer = setTimeout(() => {
                setShowError(false)
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [error])

    const onSubmit = async (data) => {
        await dispatch(loginUser(data))
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md border-gray-300">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-blue-600">Sign in to your account</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email and password to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {showError && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error || "Something want wrong"}</AlertDescription>
                        </Alert>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="your.email@example.com"
                                                type="email"
                                                {...field}
                                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="••••••••"
                                                type="password"
                                                {...field}
                                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Sign in
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-sm text-center">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}