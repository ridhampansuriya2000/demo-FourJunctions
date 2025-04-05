import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import { ReduxProvider } from "@/redux/provider"
import {ToastProvider} from "@/hooks/use-toast";

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "IMDB ",
    description: "A simple IMDB clone with CRUD functionality",
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
            <ReduxProvider>
                <ToastProvider>
                    <Navbar />
                    {children}
                </ToastProvider>
            </ReduxProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
