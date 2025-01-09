import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import { auth } from '@/utils/auth'

interface SessionUser {
  name: string,
  email: string,
  image: string,
  id: string
}

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
  const session = await auth()
  const user = session?.user as SessionUser

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar user={user} />
        {session && session?.user ? (
          <main>{children}</main>
        ) : (
          <main>Login First</main>
        )}
      </body>
    </html>
  )
}