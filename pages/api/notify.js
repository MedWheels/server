const admin = require("firebase-admin");
const serviceAccount = require("../../utils/serviceAccountKey.json");
import initFirebase from "../../utils/firebaseConfig";

// import {initializeApp, getApps} from "firebase-admin/app"
import {getMessaging} from "firebase/messaging";

export default function handler(req, res) {
	
	if(req.method === "POST"){
		return new Promise((resolve, reject) => {
			try {
				var app;
				// const app = initFirebase();
				if(!admin.apps.length){
					app = admin.initializeApp({
						credential: admin.credential.cert(serviceAccount),
						databaseURL: "https://medwheels-7ad75-default-rtdb.firebaseio.com",
					});
				}
				const messaging = admin.messaging();
				
				// Create a list containing up to 500 registration tokens.
				// These registration tokens come from the client FCM SDKs.
				const registrationTokens = [
					'eBQr_uO_UnPkj_6YKXNvvT:APA91bHGjHy0x6XQaRk2X22mzI57Nfh8Zq3ScnU7G2xvZSGYiJDJL1rWwLkJj0ZV2Fb2wWniR4uIO7SQl3XYKzEijgdC5ugXBguG8qSCdx6biEcWYdkwRQed2-Shg-NBVoqjmOeUnEfN',
					'cFFM74XDwQ7i-g28sBfS5q:APA91bFT6zb8KGTam9wyogeempds-lGLsR6_KloXdEsqpRQ5-j4fjZIvOyQLZawMNXwqiLK3PrPc7XDvoK2Nlzz8YAoXGG3Up42R4QcPMCLHdNjCSLlO6IyjNywi-H1CGktVZLZpMe9t',
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
				  
				messaging.sendMulticast(message)
					.then((response) => {
						console.log(response.successCount + ' messages were sent successfully');
						res.status(200).send(response.successCount+" hospitals notified successfully.");
						res.end();
						resolve();
					})
					.catch(err => {
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