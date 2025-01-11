import Link from "next/link"
import Image from "next/image"
import { signIn, signOut } from "@/utils/auth"
import { auth } from "@/utils/auth"

const Navbar = async () => {

  const session = await auth()

  return (
    <div>
        <nav className="bg-white dark:bg-gray-900 relative w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Image 
                        src="https://flowbite.com/docs/images/logo.svg" 
                        alt="Flowbite Logo" 
                        width={32} 
                        height={32} 
                        className="h-8"
                    />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
                </Link>
                {!session ? (
                    <form className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse"
                        action={async () => {
                            "use server"
                            await signIn("google")
                        }}
                        >
                        <button 
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Sign In
                        </button>
                    </form>
                ) : (
                    <form className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse"
                        action={async () => {
                            "use server"
                            await signOut()
                        }}
                        >
                        <button 
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Sign Out
                        </button>
                    </form>
                )}
            </div>
        </nav>
    </div>
  )
}

export default Navbar