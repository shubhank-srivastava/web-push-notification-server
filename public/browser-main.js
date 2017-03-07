var applicationServerPublicKey = 'BPrmSGzT9l-2A0jKNVgE7fJkRt-4SzcguLhvtNqZTRfKPhxhkWjdkRP-atlq_XzguexFwxDMkWEMAXmaHEQVkfM';

if ('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window) {
  console.log('Service Worker and Push is supported');

  if(Notification.permission !== 'granted'){
    Notification.requestPermission();
  }

  navigator.serviceWorker.register('sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);
    subscribeUser();
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });

} else {
  console.warn('Push messaging is not supported');
}

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function subscribeUser() {
  var applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(function(subscription) {
      console.log('User is subscribed:', subscription);
      var headers = new Headers({"Content-Type": "application/json"});
      return fetch('/api/subscribe', {headers: headers, method: 'POST', body: JSON.stringify(subscription)});
    })
    .then(function(response){
      if(response.ok){
        console.log('Successfully posted subscription information to server.');
      }else
        console.log('Failed to post subscription information to server.');
    })
    .catch(function(err) {
      console.log('Failed to subscribe the user: ', err);
    });
  });
}