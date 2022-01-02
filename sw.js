/*
 *
 *  Push Notifications codelab
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

/* eslint-env browser, serviceworker, es6 */

/*
Handle a Push Event
Before we cover how to send a push message from your backend, we need to consider what will actually happen when a subscribed user receives a push message.

When we trigger a push message, the browser receives the push message, figures out what service worker the push is for before waking up that service worker and dispatching a push event. We need to listen for this event and show a notification as a result.
*/
'use strict';
self.addEventListener('push', function(event) {
    console.log(`[Service Worker] Push Received.`);
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    const title = 'QMATIC PUSH NOTIFICATIONS';
    const options = {
        body: 'Customers waiting in Queue.',
        icon: 'images/icon.png',
        badge: 'images/badge.png'
    };

    /*
    he last thing to cover in our push event is event.waitUntil(). This method takes a promise and the browser will keep your service worker alive and running until the promise passed in has resolved.
    */

    event.waitUntil(self.registration.showNotification(title, options));

    /*To make the code above a little easier to understand we can re-write it like so:*/
    //const notificationPromise = self.registration.showNotification(title, options);
    //event.waitUntil(notificationPromise);
});
