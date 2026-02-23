// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import TwitterProvider from "next-auth/providers/twitter"

const handler = NextAuth({
  providers: [
    TwitterProvider({
      // Gunakan OAuth 2.0 yang terbaru
      version: "2.0",
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
    })
  ],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        // Ambil ID unik Twitter-nya (berguna buat data WL nanti)
        token.id = profile.data?.id; 
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Tempel ID Twitter ke sesi login
        (session.user as any).id = token.id;
      }
      return session;
    }
  }
})

export { handler as GET, handler as POST }