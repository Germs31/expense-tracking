import type { Metadata } from "next";
import "./globals.css";
import SideBar from "@/components/Sidebar/SideBar";
import Header from "@/components/Header/Header";

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
      <body className="flex h-screen w-screen">
        {/* Sidebar */}
        <SideBar />
        {/* Main Content */}
        <div className="h-full w-full bg-black">
          <Header/>
            <main>
            {children}
            </main>
        </div>
      </body>
    </html>
  );
}
