// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

const handler = NextAuth({
  providers: [
    TwitterProvider({
      version: "2.0",
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        // Akalin TypeScript pakai 'as any' biar lolos build
        token.id = (profile as any).data?.id || (profile as any).id; 
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Attach Twitter ID to session
        (session.user as any).id = token.id;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST };