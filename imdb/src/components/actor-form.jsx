"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, User, Calendar, AlignLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const actorSchema = z.object({
    name: z.string().min(1, "Actor name is required"),
    gender: z.string().min(1, "Gender is required"),
    dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Please enter a valid date",
    }),
    bio: z.string().min(10, "Bio should be at least 10 characters"),
})

export default function ActorForm({ onSuccess }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const form = useForm({
        resolver: zodResolver(actorSchema),
        defaultValues: {
            name: "",
            gender: "",
            dob: "",
            bio: "",
        },
    })

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        try {
            const response = await fetch("/api/actors", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error("Failed to add actor")
            }

            toast({
                title: "Success",
                description: "Actor added successfully",
                variant: "success",
            })

            onSuccess()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add actor",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center text-gray-700">
                                <User className="h-4 w-4 mr-2 text-blue-600" /> Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter actor name"
                                    {...field}
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center text-gray-700">Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center text-gray-700">
                                <Calendar className="h-4 w-4 mr-2 text-blue-600" /> Date of Birth
                            </FormLabel>
                            <FormControl>
                                <Input type="date" {...field} className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center text-gray-700">
                                <AlignLeft className="h-4 w-4 mr-2 text-blue-600" /> Bio
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter actor bio"
                                    rows={3}
                                    {...field}
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white"
                >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Actor
                </Button>
            </form>
        </Form>
    )
}