importScripts('https://www.gstatic.com/firebasejs/8.7.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.7.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyADsHEdTCz3xcx7zcWMirVHKIkrYusZPBU',
  projectId: 'test-e8e54',
  messagingSenderId: '581641403588797248963506',
  appId: '1:641403588797:web:7913cd992cc975381267d4',
});

var messaging = firebase.messaging();