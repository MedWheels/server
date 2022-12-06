import geoQuery from "../../utils/geoquery";
const admin = require("firebase-admin");
const serviceAccount = require("../../utils/serviceAccountKey.json");

export default async function handler(req,res) {
	return new Promise(async (resolve, reject) => {
		if (req.method === "POST") {
			try {

				if(!admin.apps.length){
					admin.initializeApp({
						credential: admin.credential.cert(serviceAccount),
						databaseURL: "https://medwheels-7ad75-default-rtdb.firebaseio.com",
					});
				}
				const messaging = admin.messaging();

				const coords = req.body.coords;
				const center = [parseFloat(coords.lat), parseFloat(coords.lng)];
				const round = parseInt(req.body.round)
				const targets = await geoQuery(center, req.body.target, round);
				// console.log(targets);
				if(!targets.length) {
					res.status(204).json({err: `No ${req.body.target} found in the given radius.`});
					res.end();
					// reject("db error: "+"No targets found.");
					return resolve();
				}
				else if(!targets[0]){
					res.status(500).json({err: String(targets[1])});
					res.end();
					// reject("db error: "+String(targets[1]));
					return resolve();
				}

				// Create a list containing up to 500 registration tokens.
				// These registration tokens come from the client FCM SDKs.
				const registrationTokens = [
					// 'eBQr_uO_UnPkj_6YKXNvvT:APA91bHGjHy0x6XQaRk2X22mzI57Nfh8Zq3ScnU7G2xvZSGYiJDJL1rWwLkJj0ZV2Fb2wWniR4uIO7SQl3XYKzEijgdC5ugXBguG8qSCdx6biEcWYdkwRQed2-Shg-NBVoqjmOeUnEfN',
					// 'cFFM74XDwQ7i-g28sBfS5q:APA91bFT6zb8KGTam9wyogeempds-lGLsR6_KloXdEsqpRQ5-j4fjZIvOyQLZawMNXwqiLK3PrPc7XDvoK2Nlzz8YAoXGG3Up42R4QcPMCLHdNjCSLlO6IyjNywi-H1CGktVZLZpMe9t',
				];

				for(const target of targets){
					console.log(target.username);
					if(target.token){
						registrationTokens.push(target.token);
					}
				}

				//if no targets with registration tokens found
				if(!registrationTokens.length){
					console.log(`No ${req.body.target} found in the given vicinity radius.`);
					res.status(204).json({err: `No ${req.body.target} found in the given vicinity radius.`})
					res.end();
					return resolve();
				}


				console.log(req.body.uid)
				console.log(coords.lat)
				console.log(coords.lng)

				const message = {
					notification:{
						title:"MedWheels",
						body:"Click to view"
					},
					data:{
						uid: req.body.uid,
						lat: String(coords.lat),
						lng: String(coords.lng),
						token: req.body.token,
						target: req.body.target
					},
					android:{
						ttl: 300000
					},
					// data: {score: '850', time: '2:45'},
					tokens: registrationTokens
				};
				  
				messaging.sendMulticast(message).then((response) => {
					console.log(response.successCount + ' messages were sent successfully');
					if (response.successCount!==0){
						res.status(200).json({message: response.successCount +` ${req.body.target} notified successfully.`});
						res.end();
						return resolve();
					}
					else{
						res.status(204).json({message: `No ${req.body.target} online in the given vicinity radius.`})
						res.end();
						return resolve();
					}
				}).catch(err => {
					console.log(err);
					res.status(500).json({err})
					res.end();
					return resolve();
				});
				// res.status(200).send(targets);
				// resolve();
				
				// repeat for hospitals after hospital dataset is ready
				// get tokens from targets array
				// build send FCM requests to these tokens (test with testhospital token first)
				// message their responses to the user in another handler.  
				
			} catch (error) {
				console.log(error);
				res.status(500).json({err: String(error)});
				// reject("db error: "+String(error));
				return resolve();
			}	
		}
		else {
			console.log("Unhandled Method: "+req.method);
			console.log(JSON.stringify(req.headers));
			res.status(501);
			// reject("Unhandled Method: "+req.method);
			return resolve();
		};
	})
	

}