import initFirebase from "../../../utils/firebaseConfig";
import { query, getFirestore, collection, where, getDocs, updateDoc, serverTimestamp, } from "firebase/firestore";

export default async function handler(req,res) {

	if(req.method === "POST") {
		return new Promise((resolve, reject) => {
			try {
				const app = initFirebase();
				const db = getFirestore(app);
				const collectionref = collection(db, 'hospitals');
				const q = query(collectionref, where("username", "==", req.body.username));
				getDocs(q).then((snapshots) => {
					updateDoc(snapshots.docs[0].ref, {token: req.body.token, timeStamp: serverTimestamp()}).then((data) => {
						res.status(200).json({message: "Updated token successfully", data});
						res.end();
						resolve();
					}).catch((err) => {
						res.status(500).json({error: String(err)});
						res.end();
						resolve();
					});
				}).catch((err) => {
					res.status(500).json({error: String(err)});
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