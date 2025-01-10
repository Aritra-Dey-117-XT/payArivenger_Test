import './globals.css'
import { Inter } from 'next/font/google'
// import { auth } from '@/utils/auth'
import NavWrapper from '@/components/NavWrapper'
import { SessionProvider } from 'next-auth/react'

// interface SessionUser {
//   name: string,
//   email: string,
//   image: string,
//   id: string
// }

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'My Beautiful App',
  description: 'An app with a beautiful navbar',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Move the auth call inside the component
  // const session = await auth()
  // const user = session?.user as SessionUser

  return (
    <html lang="en">
      <body className={inter.className}>
        <NavWrapper />
        <SessionProvider>
          <main>{children}</main>
        </SessionProvider> 
      </body>
    </html>
  )
}