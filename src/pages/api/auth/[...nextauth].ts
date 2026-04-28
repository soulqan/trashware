import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

import bcrypt from "bcryptjs";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const q = query(
          collection(db, "users"),
          where("email", "==", credentials.email)
        );

        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;

        const docSnap = snapshot.docs[0];
        const userData = docSnap.data();

        // ❗ kalau user Google
        if (!userData.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          userData.password
        );

        if (!isValid) return null;

        return {
          id: docSnap.id,
          name: userData.fullName,
          email: userData.email,
          role: userData.role, // ✅ ini penting
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  pages: {
    signIn: "/auth/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // 🔥 simpan user ke token
    async jwt({ token, user, account }) {
      if (user) {
        token.user = user;
      }

      // login Google
      if (account?.provider === "google") {
        const q = query(
          collection(db, "users"),
          where("email", "==", token.email)
        );

        const snapshot = await getDocs(q);

        let dbUser;

        if (snapshot.empty) {
          const newUser = await addDoc(collection(db, "users"), {
            email: token.email,
            fullName: token.name,
            password: null,
            role: "petugas",
            createdAt: new Date(),
          });

          dbUser = {
            id: newUser.id,
            name: token.name,
            email: token.email,
            role: "petugas",
          };
        } else {
          const docSnap = snapshot.docs[0];
          const data = docSnap.data();

          dbUser = {
            id: docSnap.id,
            name: data.fullName,
            email: data.email,
            role: data.role,
          };
        }

        token.user = dbUser;
      }

      return token;
    },

    // 🔥 ambil ke session (simple dulu)
    async session({ session, token }) {
      session.user = token.user as { id: string; name: string; email: string; role: string };
      return session;
    },
  },
});