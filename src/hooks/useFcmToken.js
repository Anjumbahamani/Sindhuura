// // src/hooks/useFcmToken.js
// import { useEffect, useState } from "react";
// import { getToken, onMessage } from "firebase/messaging";
// import { messaging } from "../firebase";
// import { updateFcmToken } from "../services/auth.service";
// import { useNotification } from "../context/NotificationContext";

// export function useFcmToken() {
//   const [fcmToken, setFcmToken] = useState(null);
//   const [fcmError, setFcmError] = useState("");
//   const { showNotification } = useNotification();

//   useEffect(() => {
//     const register = async () => {
//       try {
//         const authToken = localStorage.getItem("token");
//         if (!authToken) {
//           console.log("No auth token, skipping FCM registration.");
//           return;
//         }

//         const perm = await Notification.requestPermission();
//         if (perm !== "granted") {
//           setFcmError("Notifications permission not granted.");
//           return;
//         }

//         const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
//         if (!vapidKey) {
//           console.error("Missing VITE_FIREBASE_VAPID_KEY");
//           setFcmError("Missing VAPID key.");
//           return;
//         }

//         const token = await getToken(messaging, { vapidKey });

//         if (!token) {
//           setFcmError("Could not get FCM token.");
//           return;
//         }

//         console.log("FCM token:", token);
//         setFcmToken(token);
//         setFcmError("");

//         const oldToken = localStorage.getItem("fcmToken");
//         if (oldToken !== token) {
//           await updateFcmToken(token, authToken);
//           localStorage.setItem("fcmToken", token);
//         }
//       } catch (err) {
//         console.error("useFcmToken error:", err);
//         setFcmError("Failed to register FCM token");
//       }
//     };

//     register();
//   }, []);

//   // Foreground messages -> in-app banner
//   useEffect(() => {
//     const unsubscribe = onMessage(messaging, (payload) => {
//       console.log("FCM foreground message:", payload);
//       const { title, body } = payload.notification || {};
//       const data = payload.data || {};

//       showNotification({
//         id: payload.messageId,
//         title: title || "Sindhuura",
//         body: body || "",
//         data,
//       });
//     });

//     return unsubscribe;
//   }, [showNotification]);

//   return { fcmToken, fcmError };
// }

// src/hooks/useFcmToken.js
import { useEffect, useState, useCallback } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase";
import { updateFcmToken } from "../services/auth.service";
import { useNotification } from "../context/NotificationContext";

export function useFcmToken() {
  const [fcmToken, setFcmToken] = useState(null);
  const [fcmError, setFcmError] = useState("");
  const { showNotification } = useNotification();

  // Check if running in Median native app
  const isMedianApp = () => {
    return typeof window !== 'undefined' && 
           window.Median && 
           window.Median.isNativeApp?.();
  };

  const registerMedianPush = useCallback(async () => {
    if (!isMedianApp()) return;

    try {
      // Median's native push registration
      const token = await window.Median.push.register();
      console.log("Median push token:", token);
      setFcmToken(token);
      setFcmError("");

      const authToken = localStorage.getItem("token");
      if (authToken && token) {
        await updateFcmToken(token, authToken);
        localStorage.setItem("fcmToken", token);
      }
    } catch (err) {
      console.error("Median push registration error:", err);
      setFcmError("Failed to register for push notifications");
    }
  }, []);

  const registerWebPush = useCallback(async () => {
    if (isMedianApp()) return; // Skip web registration in native app

    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        console.log("No auth token, skipping FCM registration.");
        return;
      }

      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        setFcmError("Notifications permission not granted.");
        return;
      }

      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        console.error("Missing VITE_FIREBASE_VAPID_KEY");
        setFcmError("Missing VAPID key.");
        return;
      }

      const token = await getToken(messaging, { vapidKey });
      if (!token) {
        setFcmError("Could not get FCM token.");
        return;
      }

      console.log("FCM token:", token);
      setFcmToken(token);
      setFcmError("");

      const oldToken = localStorage.getItem("fcmToken");
      if (oldToken !== token) {
        await updateFcmToken(token, authToken);
        localStorage.setItem("fcmToken", token);
      }
    } catch (err) {
      console.error("useFcmToken error:", err);
      setFcmError("Failed to register FCM token");
    }
  }, []);

  useEffect(() => {
    // Register based on environment
    if (isMedianApp()) {
      registerMedianPush();
    } else {
      registerWebPush();
    }
  }, [registerMedianPush, registerWebPush]);

  // Handle foreground notifications
  useEffect(() => {
    if (isMedianApp()) {
      // Median's push notification event listener
      const handleMedianNotification = (payload) => {
        console.log("Median push notification:", payload);
        showNotification({
          id: payload.messageId || Date.now().toString(),
          title: payload.title || "Notification",
          body: payload.body || "",
          data: payload.data || {},
        });
      };

      // Median's event listener (check their docs for exact method)
      if (window.Median && window.Median.push) {
        window.Median.push.onNotification(handleMedianNotification);
      }

      return () => {
        if (window.Median && window.Median.push) {
          window.Median.push.offNotification(handleMedianNotification);
        }
      };
    } else {
      // Web Firebase onMessage
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("FCM foreground message:", payload);
        const { title, body } = payload.notification || {};
        const data = payload.data || {};

        showNotification({
          id: payload.messageId,
          title: title || "Sindhuura",
          body: body || "",
          data,
        });
      });

      return unsubscribe;
    }
  }, [showNotification]);

  return { fcmToken, fcmError };
}