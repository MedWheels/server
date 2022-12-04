const admin = require("firebase-admin");
const serviceAccount = require("../../utils/serviceAccountKey.json");
// import initFirebase from "../../utils/firebaseConfig";


export default function handler(req, res) {
	
	if(req.method === "POST"){
		return new Promise((resolve, reject) => {
			try {
				// const app = initFirebase();
				if(!admin.apps.length){
					admin.initializeApp({
						credential: admin.credential.cert(serviceAccount),
						databaseURL: "https://medwheels-7ad75-default-rtdb.firebaseio.com",
					});
				}
				const messaging = admin.messaging();
				
				// Create a list containing up to 500 registration tokens.
				// These registration tokens come from the client FCM SDKs.
				const registrationTokens = [

				];
				const message = {
					notification:{
						title:"Server-built notification test",
						body:"Hello!",
					},
					data:{
						id: "sender-id",
						token: "sender-token"
					},
					android:{
						ttl: "300s"
					},
					// data: {score: '850', time: '2:45'},
					tokens: registrationTokens,
				};
				  
				messaging.sendMulticast(message).then((response) => {
					console.log(response.successCount + ' messages were sent successfully');
					res.status(200).send(response.successCount+" hospitals notified successfully.");
					res.end();
					resolve();
				}).catch(err => {
					console.log(err);
					res.status(500).json({err})
					res.end();
					resolve();
				});
			} catch (error) {
				console.log(error);
				res.status(500).json({err: String(error)})
				res.end();
				resolve();	
			}
			

		});
	}
}