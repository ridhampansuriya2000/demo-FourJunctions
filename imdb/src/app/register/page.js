"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useDispatch, useSelector } from "react-redux"
import { registerUser, clearError, clearRegisterSuccess } from "@/redux/features/authSlice"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, UserPlus, AlertCircle, CheckCircle } from "lucide-react"

const registerSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

export default function RegisterPage() {
    const dispatch = useDispatch()
    const router = useRouter()
    const { loading, error, registerSuccess } = useSelector((state) => state.auth)
    const [showError, setShowError] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    useEffect(() => {
        dispatch(clearError())
        dispatch(clearRegisterSuccess())
    }, [dispatch])

    useEffect(() => {
        if (error) {
            setShowError(true)
            const timer = setTimeout(() => {
                setShowError(false)
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [error])

    useEffect(() => {
        if (registerSuccess) {
            setShowSuccess(true)
            const timer = setTimeout(() => {
                router.push("/login")
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [registerSuccess, router])

    const onSubmit = async (data) => {
        const { confirmPassword, ...userData } = data
        await dispatch(registerUser(userData))
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md border-gray-300">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-blue-600">Create an account</CardTitle>
                    <CardDescription className="text-center">Enter your details to create your account</CardDescription>
                </CardHeader>
                <CardContent>
                    {showError && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error || "Something want wrong"}</AlertDescription>
                        </Alert>
                    )}

                    {showSuccess && (
                        <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <AlertDescription>Registration successful! Redirecting to login...</AlertDescription>
                        </Alert>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="John Doe"
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

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
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
                                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors  text-white"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Create account
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-sm text-center">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}