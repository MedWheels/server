import initFirebase from "../../utils/firebaseConfig";
import { getDatabase, ref, set, update } from "firebase/database";
import whitelist from '../../utils/whitelist';

export default async function handler(req,res) {

	if(req.method === "POST") {
		return new Promise((resolve, reject) => {
			try {
				const name = req.body.name;
				const target = req.body.target;
				const targetUid = req.body.targetUid;
				const lat = req.body.lat
				const lng = req.body.lng
				//user data
				const uid = req.body.uid;
				const token = req.body.token; //for notifying

				const app = initFirebase();
				const db = getDatabase(app);
				const data = {
					name:name,
					targetUid:targetUid,
					lat:lat,
					lng:lng,
					token:token,
				}
				console.log(data)
				var payload = {}
				payload[target] = data;
				update(ref(db, `users/${uid}`), payload).then(response => {					
					res.status(200).json({message: "Informed user successfuly."});
					res.end();
					resolve();				
				}).catch(err => {
					console.log(err);
					res.status(500).json({err: String(err)});
					res.end();
					resolve();					
				});
	
			} catch (error) {
				console.log(error);
				res.status(500).json({err: String(error)});
				res.end();
				resolve();
			}
		})

	}

	//handling preflight request
	else if(req.method === "OPTIONS") {
		var origin = req.headers.origin;
		console.log("origin: "+origin);
		return new Promise((resolve, reject) => {
			// if(origin==="http://localhost:3000"){
			if (whitelist.includes(origin)){
				res.status(200);
				res.end();
				resolve();
			}
			else {
				res.status(401).send("Unauthenticated request.");
				res.end();
				resolve();
			}

		});
	}

	else {
		console.log(req.method);
		console.log(JSON.stringify(req.headers));
		res.status(501);
		return;
	};

}