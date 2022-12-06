import initFirebase from "../../utils/firebaseConfig";
import { getDatabase, ref, set, update } from "firebase/database";
import whitelist from '../../utils/whitelist';

export default async function handler(req,res) {

	if(req.method === "POST") {
		return new Promise((resolve, reject) => {
			try {
				const target = req.body.target;
				const uid = req.body.uid;

				const app = initFirebase();
				const db = getDatabase(app);
				const data = {
					name:req.body.name,
					target:req.body.target,
					targetUid:req.body.targetUid,
					lat:req.body.lat,
					lng:req.body.lng,
					token:req.body.token,
					userLat:req.body.userLat,
					userLng:req.body.userLng
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
				
				update(ref(db, `drivers/driver1`), payload).then(response => {					
					res.status(200).json({message: "Informed driver successfuly."});
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