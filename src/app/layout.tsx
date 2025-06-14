import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Active Expenses",
  description: "expense tracking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-neutral-900">
        {/* The page component will decide whether to show the signup wizard or the main layout */}
        {children}
      </body>
    </html>
  );
}
