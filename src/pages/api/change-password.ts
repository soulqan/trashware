import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res);

  if (!session || !session.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { currentPassword, newPassword } = req.body;

    // Prefer using session user id (document id). If not available, try to find user doc by email.
    const userId = (session.user as any).id;
    let userDocRef;
    if (userId) {
      userDocRef = doc(db, "users", userId);
    } else {
      const q = query(collection(db, "users"), where("email", "==", session.user.email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        userDocRef = snapshot.docs[0].ref;
      } else {
        // Fallback to using email as doc id (legacy)
        userDocRef = doc(db, "users", session.user.email as string);
      }
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Password lama dan baru harus diisi" });
    }

    // Fetch current user document
    const userSnap = await getDoc(userDocRef);
    if (!userSnap.exists()) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const userData = userSnap.data();

    // For Google OAuth users (no password), prevent password change
    if (!userData.password) {
      return res.status(400).json({ message: "Akun Anda menggunakan Google Sign-In. Tidak dapat mengubah password." });
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, userData.password);
    if (!isValid) {
      return res.status(401).json({ message: "Password saat ini salah" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in Firestore
    await updateDoc(userDocRef, {
      password: hashedPassword,
      updatedAt: new Date(),
    });

    return res.status(200).json({ ok: true, message: "Password berhasil diubah" });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Gagal mengubah password" });
  }
}
