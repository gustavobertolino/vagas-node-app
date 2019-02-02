const admin = require('firebase-admin');

let serviceAccount = require('./firebaseKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

let database = admin.firestore();
database.settings({timestampsInSnapshots: true});

module.exports = database;