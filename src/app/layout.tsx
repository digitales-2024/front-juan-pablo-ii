import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { SearchProvider } from "@/context/search-context";
import { ToastProvider } from "@/components/Toast-provider";
import { QueryProvider } from "@/components/providers/QueryProvider";

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
	title: "Juan Pablo II - Sistema de Gestión",
	description: "Sistema de gestión para Juan Pablo II",
	icons: {
		icon: "/favicon.ico",
	},
  };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	return (
		<html lang="es" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
					<QueryProvider>
						<SearchProvider>{children}</SearchProvider>
						<ToastProvider />
					</QueryProvider>
			</body>
		</html>
	);
}
