import { child, getDatabase, set, ref, get } from "firebase/database";
import initFirebase from "../../../utils/firebaseConfig";

// const app = initFirebase();


export default function handler(req,res) {
	
	// if a driver accepts a user-request, driver details is written into the database-slot of that particular user 
	if(req.method === "POST") {
		try {
			//connect to realtime database
			const app = initFirebase();
			const rdb = getDatabase(app);

			// request body data
			const uname = req.body.uname;
			// const umessage = req.body.umessage;
			// const uname = 'test3'

			set(ref(rdb, 'connects/test1/user1'), {
				uname: uname,
				desc: "val"
				// text: "message1",
				// details: "details1",
				// location : "testlocation"
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
			// const driverId = "test3"

			get(child(dbRef, `connects/test1/user1`)).then((snapshot) => {
				if (snapshot.child("uname").exists()) {
				  console.log(snapshot.val());
				//   console.log(snapshot.child("uname").val());
				 
				  res.status(200).json({output:snapshot.child("uname").val()});
					
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