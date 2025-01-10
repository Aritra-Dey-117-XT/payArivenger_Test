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
  // callbacks: {
  //   async signIn({ user, profile }) {

  //     try {

  //       console.log("CONNNECTING TO DB")
  //       await connectToDB()
  //       console.log("Connected to DB")
  //       const isAlreadyExists = await User.findOne({email: user.email}).lean()
  //       console.log("CHECKING USER Exists")

  //       if(!isAlreadyExists) {
  //         console.log("CReating user")
  //         await User.create({
  //             id: profile?.sub,
  //             name: user?.name,
  //             username: profile?.email?.split("@")[0],
  //             email: user?.email,
  //             password: "GooglePassword",
  //             imageURL: user?.image
  //           })
  //       }
  //       return true

  //     } catch (error) {
  //       console.log("Error During SignIn: " + error)
  //       return false
  //     }
      
  //   },
  //   async jwt({ token, account, profile }) {
  //     // Persist the OAuth access_token and or the user id to the token right after signin
  //     if (account) {
  //       token.id = profile?.sub
  //     }
  //     return token
  //   },
  //   async session({ session, token }) {
  //     // Send properties to the client, like an access_token and user id from a provider.
  //     session.user.id = token.id as string
      
  //     return session
  //   }
  callbacks: {
    async signIn({ user, profile }) {
      try {
        console.log("Connecting to DB...");
        await connectToDB();
        console.log("Connected to DB");
    
        console.log("Checking if user already exists...");
        const existingUser = await User.findOne({ email: user.email });
    
        if (!existingUser) {
          console.log("Creating new user...");
          await User.create({
            id: profile?.sub,
            name: user.name,
            username: user?.email?.split("@")[0],
            email: user.email,
            password: null, // No password for OAuth users
            imageURL: user.image,
            provider: "google", // Optional: Track the provider
          });
          console.log("User created successfully.");
        } else {
          console.log("User already exists.");
        }
        return true;
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false;
      }
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.id = profile?.sub; // Add user's unique ID
        token.provider = account.provider; // Track the provider
        token.accessToken = account.access_token; // Include OAuth access token
      }
      console.log("JWT Callback - Updated Token:", token);
      return token;
    },    
    async session({ session, token }) {
      session.user.id = token.id; // Add user ID to session
      session.user.provider = token.provider; // Add provider info
      session.accessToken = token.accessToken; // Include access token
      console.log("Session Callback - Updated Session:", session);
      return session;
    }    
  },
  
  // }
})