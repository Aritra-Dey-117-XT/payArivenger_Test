import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import { auth } from '@/utils/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'My Beautiful App',
  description: 'An app with a beautiful navbar',
}

export async function RootLayout({children}) {

  const session = await auth()
  const user = session?.user

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