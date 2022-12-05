import geoQuery from "../../utils/geoquery";

export default async function handler(req,res) {
	return new Promise(async (resolve, reject) => {
		if (req.method === "GET") {
			try {

				//coords, round, target
				const coords = req.body.coords;
				const center = [parseFloat(coords.lat), parseFloat(coords.lng)];
				const round = parseInt(req.body.round)
				const targets = await geoQuery(center, req.body.target, round);
				// console.log(targets);
				if(!targets.length) {
					res.status(204).json({err: `No ${req.body.target} found in the given radius.`});
					res.end();
					return resolve();
				}
				else if(!targets[0]){
					res.status(500).json({err: String(targets[1])});
					res.end();
					return resolve();
				}

				res.status(200).json({data: targets});
				res.end();
				return resolve();
	
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