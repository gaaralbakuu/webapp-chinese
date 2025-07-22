import { Inter } from "next/font/google";
import "./globals.css";
import NavigationWrapper from "./components/NavigationWrapper";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import QuickAccess from "./components/QuickAccess";
import { AppProvider } from "@/lib/AppContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Học Tiếng Trung HSK - Chinese Vocabulary Learning",
  description: "Học từ vựng tiếng Trung theo cấp độ HSK với flashcards, quiz và nhiều tính năng thú vị khác",
  keywords: "tiếng trung, HSK, từ vựng, học tiếng trung, chinese learning, vocabulary",
  authors: [{ name: "Chinese Learning Team" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "Học Tiếng Trung HSK",
    description: "Ứng dụng học từ vựng tiếng Trung hiệu quả theo cấp độ HSK",
    type: "website",
    locale: "vi_VN",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3b82f6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HSK Vocab",
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" }
    ]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        {/* Skip link for accessibility */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 text-gray-800 min-h-screen flex flex-col`}>
        <ErrorBoundary>
          <AppProvider>
            {/* Skip to main content link for screen readers */}
            <a href="#main-content" className="skip-link">
              Bỏ qua điều hướng
            </a>
            
            {/* Navigation with automatic fixed positioning */}
            <NavigationWrapper />
            
            <main id="main-content" className="flex-1" role="main">
              {children}
            </main>
            
            {/* Quick access floating menu */}
            <QuickAccess />
            
            <Footer />
          </AppProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
