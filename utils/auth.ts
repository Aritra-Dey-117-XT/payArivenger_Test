// import NextAuth from "next-auth"
// import Google from "next-auth/providers/google"
// import { connectToDB } from "./db"
// import User from "@/models/User"
 
// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [
//     Google({
//       clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
//     }),
//   ],
//   // pages: {
//   //   signIn: "/login",
//   // },
//   callbacks: {
//     async signIn({ user, profile }) {

//       try {

//         console.log("CONNNECTING TO DB")
//         await connectToDB()
//         console.log("Connected to DB")
//         const isAlreadyExists = await User.findOne({email: user.email}).lean()
//         console.log("CHECKING USER Exists")

//         if(!isAlreadyExists) {
//           console.log("CReating user")
//           await User.create({
//               id: profile?.sub,
//               name: user?.name,
//               username: profile?.email?.split("@")[0],
//               email: user?.email,
//               password: "GooglePassword",
//               imageURL: user?.image
//             })
//         }
//         return true

//       } catch (error) {
//         console.log("Error During SignIn: " + error)
//         return false
//       }
      
//     },
//     async jwt({ token, account, profile }) {
//       // Persist the OAuth access_token and or the user id to the token right after signin
//       if (account) {
//         token.id = profile?.sub
//       }
//       return token
//     },
//     async session({ session, token }) {
//       // Send properties to the client, like an access_token and user id from a provider.
//       session.user.id = token.id as string
      
//       return session
//     }
//   }
// })

import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { connectToDB } from "./db";
import User from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_OAUTH_CLIENT_ID,
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      try {
        console.log("CONNECTING TO DB");
        await connectToDB();
        console.log("Connected to DB");

        const isAlreadyExists = await User.findOne({ email: user.email }).lean();
        console.log("CHECKING USER Exists");

        if (!isAlreadyExists) {
          console.log("Creating user");
          await User.create({
            id: profile?.id, // GitHub profile ID
            name: user?.name,
            username: profile?.login, // GitHub username
            email: user?.email,
            password: "GitHubPassword",
            imageURL: user?.image,
          });
        }
        return true;
      } catch (error) {
        console.log("Error During SignIn: " + error);
        return false;
      }
    },
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and/or the user id to the token right after signin
      if (account) {
        token.id = profile?.id; // GitHub profile ID
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.user.id = token.id as string;
      return session;
    },
  },
});
