import initFirebase from "../../../utils/firebaseConfig";
import { child, getDatabase, set, ref, get } from "firebase/database";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

// const app = initFirebase();

export default function handler(req,res) {
	if(req.method === "POST") {
		try {
			//connect to realtime database
			const app = initFirebase();
			const rdb = getDatabase(app);

			//sample data to write
			// const uname = req.body.uname;
			// const umessage = req.body.umessage;
			const uname = 'test3'

			set(ref(rdb, 'messages/'+uname+"/message1"), {
				text: "message1",
				details: "details1",
				location : "testlocation"
			});
			res.status(200).json({msg:"done"});

		} catch (error) {
			// console.log("error here");
			console.log(error);
			res.status(500).json({err: String(error)});
		}
	}

	else if (req.method === "GET") {
		try {
			const app = initFirebase();
			const rdb = getDatabase(app);
			const dbRef = ref(rdb);

			//sample data to read
			//get from req.query
			const driverId = "test3"

			get(child(dbRef, `messages/${driverId}/message1`)).then((snapshot) => {
				if (snapshot.exists()) {
				  console.log(snapshot.val());
				  res.status(200).json({output:snapshot.val()});
					
					//{
					// 	"output": {
					// 	  "email": "testemail3",
					// 	  "location": "testlocation",
					// 	  "username": "testname3"
					// 	}
					//}

				} else {
				  console.log("No data available");
				  res.status(200).json({output:"No data available"});
				}
			  }).catch((error) => {
				console.error(error);
				res.status(500).json({err: String(error)});
			  });
		} catch (error) {
			console.log(error);
			res.status(500).json({err: String(error)});
		}
	}
}