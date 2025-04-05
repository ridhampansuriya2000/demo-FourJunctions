"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Film, LogIn, UserPlus, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSelector, useDispatch } from "react-redux"
import { logoutUser } from "@/redux/features/authSlice"
import { usePathname, useRouter } from "next/navigation"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
    const { user } = useSelector((state) => state.auth)
    const [isClient, setIsClient] = useState(false)

    const dispatch = useDispatch()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleLogout = async () => {
        await dispatch(logoutUser())
        router.push("/login")
    }

    if (!isClient) return null

    return (
        <header className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <Film className="h-6 w-6 text-blue-600" />
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        IMDB
                    </span>
                </Link>
                <nav className="flex items-center gap-4">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 focus-visible:ring-0 focus-visible:ring-offset-0">
                                    <User className="h-4 w-4 mr-2" />
                                    {user.name || "Account"}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer hover:bg-blue-50">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            {pathname === "/register" && (
                                <Link href="/login">
                                    <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 cursor-pointer">
                                        <LogIn className="h-4 w-4 mr-2" />
                                        Login
                                    </Button>
                                </Link>
                            )}
                            {pathname === "/login" && (
                                <Link href="/register">
                                    <Button className="bg-blue-600 hover:bg-blue-700 transition-colors text-white cursor-pointer">
                                        <UserPlus className="h-4 w-4 mr-2" />
                                        Register
                                    </Button>
                                </Link>
                            )}
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}
