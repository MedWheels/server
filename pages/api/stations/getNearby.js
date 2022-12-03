import geoQuery from "../../../utils/geoquery";

export default async function handler(req,res) {
	return new Promise(async (resolve, reject) => {
		if (req.method === "POST") {
			try {
				const coords = req.body.coords;
				const center = [parseFloat(coords.lat), parseFloat(coords.lng)];
				const stations = await geoQuery(center, "stations");
				// console.log(stations);
				if(!stations.length) {
					res.status(500).json({err: "No stations found."});
					// reject("db error: "+"No stations found.");
					resolve();
				}
				else if(!stations[0]){
					res.status(500).json({err: String(stations[1])});
					// reject("db error: "+String(stations[1]));
					resolve();
				}
				//repeat for hospitals after hospital dataset is ready
				res.status(200).send(stations);
				resolve();

				// get tokens from stations array
				// build send FCM requests to these tokens (test with testhospital token first)
				// message their responses to the user in another handler.  
				
			} catch (error) {
				console.log(error);
				res.status(500).json({err: String(error)});
				// reject("db error: "+String(error));
				resolve();
			}	
		}
		else {
			console.log("Unhandled Method: "+req.method);
			console.log(JSON.stringify(req.headers));
			res.status(501);
			// reject("Unhandled Method: "+req.method);
			resolve();
		};
	})
	

}