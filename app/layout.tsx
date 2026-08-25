import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI & Dev Portfolio",
  description: "Showcasing AI tools and programming projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="dark">
      <body className="bg-neutral-950 text-neutral-100 min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200">
        <nav className="border-b border-neutral-800 bg-neutral-950/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="font-bold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
              LOGO
            </div>
            <div className="flex gap-6 text-sm font-medium">
                          <a href="#" className="hover:text-cyan-400 transition-colors">首頁</a>
                          <a href="#projects" className="hover:text-cyan-400 transition-colors">作品展示</a>
                        </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
