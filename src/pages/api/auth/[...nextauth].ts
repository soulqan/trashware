import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
// const bcrypt = require("bcryptjs");

// interface UserData {
//   name: string;
//   email: string;
//   password: string;
// }

interface UserData {
  fullName: string;
  email: string;
  password: string;
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const q = query(collection(db, "users"), where("email", "==", credentials.email));

          const snapshot = await getDocs(q);

          if (snapshot.empty) {
            return null;
          }

          // smbil langsung doc pertama
          const docSnap = snapshot.docs[0];

          if (!docSnap) return null;

          const userData = docSnap.data() as UserData;

          // ek password
          const isValid = await bcrypt.compare(credentials.password, userData.password);

          if (!isValid) return null;

          return {
            id: docSnap.id,
            name: userData.fullName,
            email: userData.email,
          };
        } catch (error) {
          console.log("Login error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  pages: {
    signIn: "/auth/login", // pakai halaman login kamu
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.user = user;
      }

      if (account?.provider === "google") {
        token.provider = "google";
        token.googleAccessToken = account.access_token;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = token.user as typeof session.user;
      return session;
    },
  },
});
