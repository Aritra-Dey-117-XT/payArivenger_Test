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

export async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This is a placeholder. In a real app, you'd fetch the user data from your auth provider
  const user = { name: 'John Doe', email: 'john@example.com' }
  const session = await auth()

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar user={session?.user as SessionUser} />
        {session && session?.user ? (
          <main>{children}</main>
        ) : (
          <main>Login First</main>
        )}
      </body>
    </html>
  )
}

export default RootLayout