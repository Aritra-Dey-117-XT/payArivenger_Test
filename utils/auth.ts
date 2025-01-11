import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

interface SessionUser {
  user: {
    id: String
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  })],
  callbacks: {
    async signIn({ account, profile, user }) {
      if (!profile) {
        console.warn("Profile is undefined, rejecting sign-in.");
        return false;
      }
    
      const isEmailVerified = profile.email_verified;

      if (isEmailVerified) {
        return true;
      }
    
      console.warn("Sign-in rejected: Email not verified or invalid domain.");
      return false;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.id = profile?.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      return session
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60
  },
  secret: process.env.AUTH_SECRET
})