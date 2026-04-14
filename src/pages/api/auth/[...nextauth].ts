import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        // 🔥 ini simulasi login
        if (credentials?.email === "admin@trashware.id" && credentials?.password === "password") {
          return {
            id: "1",
            name: "Admin",
            email: "admin@trashware.id",
          };
        }

        return null; // login gagal
      },
    }),
  ],

  pages: {
    signIn: "/auth/login", // pakai halaman login kamu
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user as typeof session.user;
      return session;
    },
  },
});
