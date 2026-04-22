import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password, fullName } = req.body;

  // validasi
  if (!email || !password || !fullName) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  try {
    // cek email sudah ada
    const q = query(collection(db, "users"), where("email", "==", email));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    //  hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  simpan ke Firestore
    await addDoc(collection(db, "users"), {
      email,
      fullName,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return res.status(200).json({ message: "Register berhasil" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}
