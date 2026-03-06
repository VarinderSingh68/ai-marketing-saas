import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";

// This prevents the "Missing Publishable Key" error during Vercel build
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}