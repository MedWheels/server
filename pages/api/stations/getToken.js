import initFirebase from "../../../utils/firebaseConfig";
import { query, getFirestore, collection, getDocs, where, } from "firebase/firestore";

export default async function handler(req,res) {

	if(req.method === "GET") {
		return new Promise((resolve, reject) => {
			try {
				const app = initFirebase();
				const db = getFirestore(app);
				const collectionref = collection(db, 'stations');
				const q = query(collectionref, where("username", "==", req.query.username));
				getDocs(q).then((querySnapshots) => {
					var data = querySnapshots.docs[0].data();
					if(data.token){
						res.status(200).json({token: data.token, timeStamp:data.timeStamp});
						res.end();
						resolve();
					}
					else {
						res.status(204);
						res.end();
						resolve();
					}
				}).catch((err) => {
					console.log(err);
					res.status(500).json({error: err});
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

	return;

}