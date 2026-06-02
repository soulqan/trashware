import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, type DocumentReference, type DocumentData } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res);

  if (!session || !session.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Determine user document reference. Prefer session user id (doc id), else try to find by email.
  const userId = (session.user as { id?: string }).id;
  let userDocRef: DocumentReference<DocumentData>;
  if (userId) {
    userDocRef = doc(db, "users", userId);
  } else {
    const q = query(collection(db, "users"), where("email", "==", session.user.email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      userDocRef = snapshot.docs[0].ref;
    } else {
      // Fallback to email as doc id (legacy)
      userDocRef = doc(db, "users", session.user.email as string);
    }
  }

  if (req.method === "GET") {
    try {
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        return res.status(200).json({ user: {
          ...data,
          name: data.fullName || data.name || "",
        } });
      } else {
        // Return session user if no doc exists yet
        return res.status(200).json({ 
          user: {
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
            phone: null,
            address: null,
          }
        });
      }
    } catch (error) {
      console.error("GET profile error:", error);
      return res.status(500).json({ message: "Failed to fetch profile" });
    }
  }

  if (req.method === "PUT") {
    try {
      const { name, phone } = req.body || {};
      
      // Get existing data first
      const userSnap = await getDoc(userDocRef);
      const existingData = userSnap.exists() ? userSnap.data() : {};
      
      const userData = {
        ...existingData,
        fullName: name || existingData.fullName || session.user.name,
        email: session.user.email,
        phone: phone !== undefined ? phone : (existingData.phone || null),
        updatedAt: serverTimestamp(),
      };

      // Always use setDoc with merge to ensure data is saved
      await setDoc(userDocRef, userData, { merge: true });

      return res.status(200).json({ ok: true, user: { ...userData, name: userData.fullName } });
    } catch (error) {
      console.error("PUT profile error:", error);
      return res.status(500).json({ message: "Failed to update profile" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
