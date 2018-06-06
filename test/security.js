const Security = require('../server/security');

let token = Security.generatedToken('super cool id');
console.log('Token:', token);

console.log(Security.validateToken(token));

Security.expiry = 60;

// valid token
setTimeout(() => {
    console.log(Security.validateToken(token));
}, 1000 * 30); // 30 seconds

// expired token
setTimeout(() => {
    console.log(Security.validateToken(token));
}, 1000 * 65); // 65 seconds