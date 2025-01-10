import Link from 'next/link'
import Image from 'next/image'
import { User, LogOut } from 'lucide-react'
import { signIn, signOut } from '@/utils/auth'

const Navbar = ({ user }: { user?: { name: string, email: string, image: string, id: string  } }) => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <Image src="/logo.svg" alt="Logo" width={40} height={40} />
            </Link>
          </div>
          <div className="ml-6 flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Image
                  className="h-8 w-8 rounded-full"
                  src={user.image}
                  alt={user.name}
                  width={32}
                  height={32}
                />
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                <Link
                  href="/profile"
                  className="text-gray-600 hover:text-gray-900"
                  title="Profile"
                >
                  <User className="h-5 w-5" />
                </Link>

                <form
                  className="text-gray-600 hover:text-gray-900"
                  title='Sign Out'
                  action={async () => {
                    "use server"
                    await signOut()
                  }}
                >
                  <button type="submit"><LogOut /></button>
                </form>
              </div>
            ) : (
              <form
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                action={async () => {
                  "use server"
                  await signIn("github")
                }}
              >
                <button type="submit">SignIn with Google</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

