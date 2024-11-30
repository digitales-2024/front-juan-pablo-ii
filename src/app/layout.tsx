import { Providers } from "@/redux/providers";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";

import "./globals.css";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Juan Pablo II",
    description: "Aplicación Juan.P. II",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" className="dark">
            <body
                className={`relative ${geistSans.variable} ${geistMono.variable} border-border bg-background text-foreground`}
            >
                <Toaster
                    richColors
                    position="top-center"
                    toastOptions={{
                        style: {
                            backgroundColor: "var(--background)", // Asegura que el fondo no sea transparente
                            color: "var(--foreground)",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        },
                    }}
                    closeButton
                />
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
