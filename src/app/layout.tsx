import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { SearchProvider } from "@/context/search-context";
import { ToastProvider } from "@/components/Toast-provider";
import { AuthProvider } from "@/components/providers/AuthProvider";

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
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable}  antialiased `}
			>
				<AuthProvider>
					<SearchProvider>{children}</SearchProvider>
					<ToastProvider />
				</AuthProvider>
			</body>
		</html>
	);
}
