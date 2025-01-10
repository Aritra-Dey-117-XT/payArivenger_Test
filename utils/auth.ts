import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { connectToDB } from "./db"
import User from "@/models/User"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    }),
  ],
  // pages: {
  //   signIn: "/login",
  // },
  callbacks: {
    async signIn({ user, profile }) {

      try {

        console.log("CONNNECTING TO DB")
        await connectToDB()
        console.log("Connected to DB")
        const isAlreadyExists = await User.findOne({email: user.email}).lean()
        console.log("CHECKING USER Exists")

        if(!isAlreadyExists) {
          console.log("CReating user")
          await User.create({
              id: profile?.sub,
              name: user?.name,
              username: profile?.email?.split("@")[0],
              email: user?.email,
              password: "GooglePassword",
              imageURL: user?.image
            })
        }
        return true

      } catch (error) {
        console.log("Error During SignIn: " + error)
        return false
      }
      
    },
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.id = profile?.sub
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.user.id = token.id as string
      
      return session
    }
  }
})