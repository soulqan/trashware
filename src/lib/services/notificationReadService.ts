import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';

export const notificationReadService = {
  // Mark notification as read
  async markAsRead(notificationId: string) {
    try {
      const notifReadRef = doc(
        db,
        'notificationRead',
        notificationId
      );
      await setDoc(notifReadRef, {
        notificationId,
        readAt: new Date(),
      });
      console.log(`✅ Marked as read: ${notificationId}`);
    } catch (error) {
      console.error('Error marking as read:', error);
      throw error;
    }
  },

  // Unmark notification as read (mark as new)
  async markAsNew(notificationId: string) {
    try {
      await deleteDoc(doc(db, 'notificationRead', notificationId));
      console.log(`✅ Marked as new: ${notificationId}`);
    } catch (error) {
      console.error('Error marking as new:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      // This will be handled by the caller by marking each notification
      console.log('✅ Marking all notifications as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  },

  // Get all read notification IDs
  async getReadNotificationIds(): Promise<string[]> {
    try {
      const snapshot = await getDocs(collection(db, 'notificationRead'));
      return snapshot.docs.map((doc) => doc.data().notificationId);
    } catch (error) {
      console.error('Error getting read notifications:', error);
      return [];
    }
  },

  // Subscribe to read notification IDs (real-time)
  subscribeToReadNotifications(callback: (ids: string[]) => void) {
    try {
      const readCollection = collection(db, 'notificationRead');
      return getDocs(readCollection).then((snapshot) => {
        const ids = snapshot.docs.map((doc) => doc.data().notificationId);
        callback(ids);

        // Also set up real-time listener
        // (Note: getDocs is one-time, for real-time use onSnapshot)
        return () => {}; // Return empty unsubscribe function for now
      });
    } catch (error) {
      console.error('Error subscribing to read notifications:', error);
      return () => {};
    }
  },

  // Cleanup read notifications for bins that are no longer full
  async cleanupReadNotificationsForNonFullBins(
    fullBinIds: Set<string>
  ): Promise<void> {
    try {
      const snapshot = await getDocs(collection(db, 'notificationRead'));

      // Delete read entries for bins that are not full anymore
      const deletePromises = snapshot.docs.map((docSnapshot) => {
        const notificationId = docSnapshot.data().notificationId;

        // If this notification ID is not in current full bins, delete it
        if (!fullBinIds.has(notificationId)) {
          return deleteDoc(doc(db, 'notificationRead', docSnapshot.id));
        }
        return Promise.resolve();
      });

      await Promise.all(deletePromises);
      console.log('✅ Cleaned up read notifications for non-full bins');
    } catch (error) {
      console.error('Error cleaning up read notifications:', error);
    }
  },
};
