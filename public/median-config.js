// This file will be loaded only in Median native apps
window.Median = window.Median || {};

// Median push notification handlers
window.Median.push = {
  register: async function() {
    // Median will handle this natively
    return new Promise((resolve, reject) => {
      // Median provides a callback-based API
      if (window.MedianNative && window.MedianNative.registerPush) {
        window.MedianNative.registerPush((token) => {
          resolve(token);
        }, (error) => {
          reject(error);
        });
      } else {
        reject(new Error("Median push not available"));
      }
    });
  },
  
  onNotification: function(callback) {
    // Store callback for when notification arrives
    this._notificationCallback = callback;
    
    // Listen for Median's notification event
    document.addEventListener('medianPushNotification', (event) => {
      if (this._notificationCallback) {
        this._notificationCallback(event.detail);
      }
    });
  },
  
  offNotification: function(callback) {
    if (this._notificationCallback === callback) {
      this._notificationCallback = null;
    }
  }
};