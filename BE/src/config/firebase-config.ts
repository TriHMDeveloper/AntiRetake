import admin from 'firebase-admin';

import serviceAccountKey from './service-account-key.json';

const serviceAccount = serviceAccountKey as admin.ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const auth = admin.auth();
