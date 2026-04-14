import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  getDocs,
  QueryConstraint,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { Notification } from '@/lib/types/notification';

export const notificationService = {
  // Subscribe to notifications with optional filter
  subscribeToNotifications(
    callback: (notifications: Notification[]) => void,
    filter?: 'baru' | 'dibaca'
  ) {
    let q;

    if (filter === 'baru') {
      q = query(collection(db, 'notifications'), where('status', '==', 'baru'));
    } else if (filter === 'dibaca') {
      q = query(collection(db, 'notifications'), where('status', '==', 'dibaca'));
    } else {
      q = query(collection(db, 'notifications'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().createdAt?.toDate() || new Date(),
        }))
        .sort((a: any, b: any) => b.createdAt - a.createdAt) as Notification[];

      callback(notifications);
    });

    return unsubscribe;
  },

  // Mark single notification as read
  async markAsRead(notificationId: string) {
    try {
      const notifRef = doc(db, 'notifications', notificationId);
      await updateDoc(notifRef, {
        status: 'dibaca',
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('status', '==', 'baru')
      );
      const snapshot = await getDocs(q);

      const batch = snapshot.docs.map((d) =>
        updateDoc(doc(db, 'notifications', d.id), {
          status: 'dibaca',
        })
      );

      await Promise.all(batch);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Get notification counts
  async getNotificationCounts() {
    try {
      const allQuery = query(collection(db, 'notifications'));
      const newQuery = query(collection(db, 'notifications'), where('status', '==', 'baru'));
      const readQuery = query(collection(db, 'notifications'), where('status', '==', 'dibaca'));

      const [allSnap, newSnap, readSnap] = await Promise.all([
        getDocs(allQuery),
        getDocs(newQuery),
        getDocs(readQuery),
      ]);

      return {
        semua: allSnap.size,
        baru: newSnap.size,
        dibaca: readSnap.size,
      };
    } catch (error) {
      console.error('Error getting notification counts:', error);
      throw error;
    }
  },

  // Check if notification already exists for a bin
  async notificationExists(binId: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('binId', '==', binId),
        where('status', '==', 'baru')
      );
      const snapshot = await getDocs(q);
      return snapshot.size > 0;
    } catch (error) {
      console.error('Error checking notification existence:', error);
      return false;
    }
  },

  // Create notification for full bin
  async createNotification(bin: any) {
    try {
      // Check if notification already exists
      const exists = await this.notificationExists(bin.id);
      if (exists) {
        console.log(`Notification already exists for ${bin.id}`);
        return;
      }

      // Parse building and floor from location or bin data
      const building = bin.building || 'Unknown Building';
      const floor = bin.floor || 'Unknown Floor';

      const notification = {
        binId: bin.id,
        building: building,
        floor: floor,
        title: `${building} - ${floor}`,
        description: `Tempat sampah penuh (${bin.capacity}%) - segera kosongkan`,
        capacity: bin.capacity,
        location: bin.location || `${building} ${floor}`,
        status: 'baru',
        type: 'error',
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'notifications'), notification);
      console.log(`✅ Notification created for ${bin.id}:`, docRef.id);
      return docRef;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Auto-create notifications for full bins
  async autoCreateNotificationsForFullBins(bins: any[]) {
    try {
      const fullBins = bins.filter((bin) => bin.capacity >= 90);

      if (fullBins.length === 0) {
        return;
      }

      for (const bin of fullBins) {
        await this.createNotification(bin);
      }
    } catch (error) {
      console.error('Error in auto-create notifications:', error);
    }
  },
};
