const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

export const verifyIdToken  = async (token) => {
	if (!admin.apps.length) {
		admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
			databaseURL: "https://medwheels-7ad75-default-rtdb.firebaseio.com"
		});
	}

	return admin
		.auth()
		.verifyIdToken(token)
		.catch((error) => {
			throw error;
		});
}