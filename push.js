var push = require('web-push');
//import webpush from 'webpush';

// VAPID keys should be generated only once.
var vapidKeys = push.generateVAPIDKeys();

// Prints 2 URL Safe Base64 Encoded Strings
//console.log(vapidKeys.publicKey, vapidKeys.privateKey);
console.log(vapidKeys);

/*
{
  publicKey: 'BNQLMyeQqTrArjC79qQnpVjBMvpVAYF5zl7ovVphau1eLe4hcXTPgoPx027IZLbUcZWGARQ4DIZMqv1YZert43U',
  privateKey: '58QVyT0-VylqGjGjZgBAM2bl6Eayypb7AE6ptoTOKr0'
}
*/