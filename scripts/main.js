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

/* eslint-env browser, es6 */

'use strict';

//Here you can issue the generated Public key pair.
const applicationServerPublicKey = 'BEhaXTYWVOZT7S4ysfSWNTZCUviBoOpI8wqgmpyNgkogrook2O8WDNj8PAj21s0GekoaFcmLGPU6kaZZYizangU';

const pushButton = document.querySelector('.js-push-btn');

let isSubscribed = false;
let swRegistration = null;

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

/*Register a Service Worker
This code checks if service workers and push messaging is supported by the current browser and if it is, it registers our sw.js file. */
if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}


/*
Initialize State
At the moment the web app's button is disabled and can't be clicked. This is because it's good practice to disable the push button by default and enable it once you know push is supported and can know if the user is currently subscribed or not.

Let's create two functions in scripts/main.js, one called initializeUI, which will check if the user is currently subscribed, and one called updateBtn which will enable our button and change the text if the user is subscribed or not.

We want our initializeUI function to look like this:
*/
function initializeUI() {		
  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
  
  /*
	Subscribe the user:
	At the moment our ‘Enable Push Messaging' button doesn't do too much, so let's fix that.
	Add a click listener to our button in the initializeUI() function, like so:
	*/
	pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      // TODO: Unsubscribe user
    } else {
      subscribeUser();
    }
  });
}

/*
Our new method uses the swRegistration from the previous step and calls getSubscription() on it's pushManager. getSubscription() is a method that returns a promise that resolves with the current subscription if there is one, otherwise it'll return null. With this we can check if the user is already subscribed or not, set some state and then call updateBtn() so the button can be enabled with some helpful text.

Add the following code to implement the updateBtn() function.
*/
function updateBtn() {	
	
  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
  
  /*
	Handle Permission Denied
	One thing that we haven't handled yet is what happens if the user blocks the permission request. This needs some unique consideration because if the user blocks the permission, our web app will not be able to re-show the permission prompt and will not be able to subscribe the user, so we need to at least disable the push button so the user knows it can't be used.
	The obvious place for us to handle this scenario is in the updateBtn() function. All we need to do is check the Notification.permission value, like so:
	*/
	if (Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Blocked.';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }
  /*
  We know that if the permission is denied, then the user can't be subscribed and there is nothing more we can do, so disabling the button for good is the best approach.
  */
}

/*
This function simply changes the text depending on the whether the user is subscribed or not and then enables the button.
The last thing to do is call initializeUI() when our service worker is registered.
*/
navigator.serviceWorker.register('sw.js')
.then(function(swReg) {
  console.log('Service Worker is registered', swReg);

  swRegistration = swReg;
  initializeUI();
})


/*
When the user clicks the push button, we first disable the button just to make sure the user can't click it a second time while we're subscribing to push as it can take some time.

Then we call subscribeUser() when we know the user isn't currently subscribed, so copy and paste the following code into scripts/main.js.
*/
function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed.');

    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateBtn();
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  });
}

/*
The method updateSubscriptionOnServer is a method where in a real application we would send our subscription to a backend, but for our codelab we are going to print the subscription in our UI which will help us later on.
*/
function updateSubscriptionOnServer(subscription) {
	debugger;
  // TODO: Send subscription to application server
console.log("updateSubscriptionOnServer(subscription): ", subscription);
  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails =
    document.querySelector('.js-subscription-details');

  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('is-invisible');
  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
}