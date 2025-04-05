"use client"

import * as React from "react"
import { X, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {useEffect} from "react";

export function MultiSelect({ options, selected, onChange, placeholder = "Select options", className }) {
    const [isOpen, setIsOpen] = React.useState(false)
    const containerRef = React.useRef(null)

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleOutsideClick)
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick)
        }
    }, [])

    const handleToggle = () => {
        setIsOpen(!isOpen)
    }

    const handleSelect = (value) => {
        if (!selected.includes(value)) {
            onChange([...selected, value])
        }
    }

    const handleUnselect = (value) => {
        onChange(selected.filter((item) => item !== value))
    }

    return (
        <div className="relative w-full" ref={containerRef}>
            <Button
                type="button"
                variant="outline"
                onClick={handleToggle}
                className={cn(
                    "w-full justify-between font-normal text-left cursor-pointer",
                    selected.length > 0 ? "h-auto min-h-10 py-2" : "",
                    className,
                )}
            >
                <div className="flex flex-wrap gap-1">
                    {selected.length > 0 ? (
                        selected.map((value) => {
                            const option = options.find((o) => o.value === value)
                            return (
                                <Badge key={value} variant="secondary" className="mr-1 px-1 py-0">
                                    {option?.label}
                                    <div
                                        type="button"
                                        className="ml-1 rounded-full outline-none"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleUnselect(value)
                                        }}
                                    >
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer" />
                                    </div>
                                </Badge>
                            )
                        })
                    ) : (
                        <span className="text-muted-foreground">{placeholder}</span>
                    )}
                </div>
                <div className="opacity-50 ml-2">▼</div>
            </Button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 rounded-md border border-gray-200 bg-white shadow-lg">
                    <div className="max-h-60 overflow-auto p-1">
                        {options
                            .filter((option) => !selected.includes(option.value))
                            .map((option) => (
                                <div
                                    key={option.value}
                                    className="flex items-center px-2 py-2 text-sm cursor-pointer hover:bg-blue-50 rounded-md"
                                    onClick={() => {
                                        handleSelect(option.value)
                                    }}
                                >
                                    <div className="flex-grow">{option.label}</div>
                                    {selected.includes(option.value) && <Check className="h-4 w-4 text-blue-600" />}
                                </div>
                            ))}
                        {options.filter((option) => !selected.includes(option.value)).length === 0 && (
                            <div className="px-2 py-2 text-sm text-gray-500">No options available</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}