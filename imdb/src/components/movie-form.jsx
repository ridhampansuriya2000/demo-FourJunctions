"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useDispatch, useSelector } from "react-redux"
import { fetchActors } from "@/redux/features/actorSlice"
import { fetchProducers } from "@/redux/features/producerSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MultiSelect } from "@/components/multi-select"
import { Loader2, Plus, Film, Calendar, AlignLeft, Image, User, Users } from "lucide-react"
import ActorForm from "@/components/actor-form"
import ProducerForm from "@/components/producer-form"

const currentYear = new Date().getFullYear()

const movieSchema = z.object({
    name: z.string().min(1, "Movie name is required"),
    year: z.coerce
        .number()
        .min(1888, "Year must be at least 1888 (first movie ever made)")
        .max(currentYear + 5, `Year cannot be more than ${currentYear + 5}`),
    plot: z.string().min(10, "Plot should be at least 10 characters"),
    poster: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    producer: z.string().min(1, "Producer is required"),
    actors: z.array(z.string()).min(1, "At least one actor is required"),
})

export default function MovieForm({ onSubmit, isSubmitting, initialData }) {
    const dispatch = useDispatch()
    const { actors } = useSelector((state) => state.actors)
    const { producers } = useSelector((state) => state.producers)
    const [actorDialogOpen, setActorDialogOpen] = useState(false)
    const [producerDialogOpen, setProducerDialogOpen] = useState(false)

    const form = useForm({
        resolver: zodResolver(movieSchema),
        defaultValues: {
            name: initialData?.name || "",
            year: initialData?.year || currentYear,
            plot: initialData?.plot || "",
            poster: initialData?.poster || "",
            producer: initialData?.producer?._id || "",
            actors: initialData?.actors?.map((actor) => actor._id) || [],
        },
    })

    useEffect(() => {
        dispatch(fetchActors())
        dispatch(fetchProducers())

    }, [dispatch])

    const handleActorAdded = () => {
        setActorDialogOpen(false)
        dispatch(fetchActors())
    }

    const handleProducerAdded = () => {
        setProducerDialogOpen(false)
        dispatch(fetchProducers())
    }

    const actorOptions = actors.map((actor) => ({
        label: actor.name,
        value: actor._id,
    }))

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center text-gray-700">
                                    <Film className="h-4 w-4 mr-2 text-blue-600" /> Movie Name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter movie name"
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
                        name="year"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center text-gray-700">
                                    <Calendar className="h-4 w-4 mr-2 text-blue-600" /> Year of Release
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Year"
                                        {...field}
                                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="plot"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center text-gray-700">
                                <AlignLeft className="h-4 w-4 mr-2 text-blue-600" /> Plot
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter movie plot"
                                    rows={4}
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
                    name="poster"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center text-gray-700">
                                <Image className="h-4 w-4 mr-2 text-blue-600" /> Poster URL
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="https://example.com/poster.jpg"
                                    {...field}
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="producer"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center text-gray-700">
                                    <User className="h-4 w-4 mr-2 text-blue-600" /> Producer
                                </FormLabel>
                                <div className="flex gap-2">
                                    <FormControl>
                                        <Select className="absolute z-50 w-full mt-1 rounded-md border border-gray-200" onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                                <SelectValue placeholder="Select a producer" />
                                            </SelectTrigger>
                                            <SelectContent className={"bg-white shadow-lg"}>
                                                {producers.map((producer) => (
                                                    <SelectItem key={producer._id} value={producer._id}>
                                                        {producer.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <Dialog open={producerDialogOpen} onOpenChange={setProducerDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="border-blue-300 text-blue-700 hover:bg-blue-50 cursor-pointer"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add New Producer</DialogTitle>
                                            </DialogHeader>
                                            <ProducerForm onSuccess={handleProducerAdded} />
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="actors"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center text-gray-700">
                                    <Users className="h-4 w-4 mr-2 text-blue-600" /> Actors
                                </FormLabel>
                                <div className="flex gap-2">
                                    <div className="flex-grow">
                                        <MultiSelect
                                            options={actorOptions}
                                            selected={field.value || []}
                                            onChange={(newValue) => {
                                                field.onChange(newValue)
                                                console.log("Selected actors:", newValue)
                                            }}
                                            placeholder="Select actors"
                                            className="w-full"
                                        />
                                    </div>
                                    <Dialog open={actorDialogOpen} onOpenChange={setActorDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="border-blue-300 text-blue-700 hover:bg-blue-50 cursor-pointer"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add New Actor</DialogTitle>
                                            </DialogHeader>
                                            <ActorForm onSuccess={handleActorAdded} />
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white"
                >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Movie" : "Add Movie"}
                </Button>
            </form>
        </Form>
    )
}