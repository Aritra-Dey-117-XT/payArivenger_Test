import Navbar from "./Navbar"
import { auth } from '@/utils/auth'

interface SessionUser {
    name: string,
    email: string,
    image: string,
    id: string
  }

const NavWrapper = async () => {

      const session = await auth()
      const user = session?.user as SessionUser

    return (
        <Navbar user={user} />
    )
}

export default NavWrapper