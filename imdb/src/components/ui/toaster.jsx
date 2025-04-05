"use client"

import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const variantClasses = {
    default: "bg-white text-black border-gray-200",
    success: "bg-green-100 text-green-800 border-green-700",
    destructive: "bg-red-100 text-red-800 border-red-700",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-600",
    info: "bg-blue-100 text-blue-800 border-blue-700",
}

const positionClasses = {
    "top-left": "top-0 left-0 items-start",
    "top-center": "top-0 left-1/2 -translate-x-1/2 items-center",
    "top-right": "top-0 right-0 items-end",

    "bottom-left": "bottom-0 left-0 items-start",
    "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 items-center",
    "bottom-right": "bottom-0 right-0 items-end",
}



export function Toaster() {
    const { toasts, dismiss } = useToast()

    const position = toasts[0]?.position || "top-right"
    const containerClass = positionClasses[position] || positionClasses["top-right"]

    return (
        <div
            className={cn(
                "fixed z-[100] flex flex-col gap-2 p-4 max-w-md w-full",
                containerClass
            )}
        >
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={cn(
                        "flex w-full items-center justify-between space-x-4 rounded-md border p-4 shadow-lg",
                        variantClasses[toast.variant || "default"]
                    )}
                >
                    <div className="flex-1">
                        {toast.title && <div className="font-semibold">{toast.title}</div>}
                        {toast.description && <div className="text-sm opacity-90">{toast.description}</div>}
                    </div>
                    <button
                        onClick={() => dismiss(toast.id)}
                        className="rounded-full p-1 text-inherit opacity-70 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ))}
        </div>
    )
}