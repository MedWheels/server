import initFirebase from "../../../utils/firebaseConfig";
import { child, getDatabase, set, ref, get } from "firebase/database";
import { GeoPoint } from 'firebase/firestore/lite';
import "firebase/firestore";
import { query, orderBy, startAt, endAt, getFirestore, collection, getDocs } from "firebase/firestore";

// const app = initFirebase();
const geofire = require('geofire-common');

export default function handler(req,res) {
	if (req.method === "GET") {
		try {
			const app = initFirebase();
			const db = getFirestore(app);
			const center = [12.94375013691914, 77.59832206349157]; //get from request params
			var radiusInM = 5 * 1000;

			// Each item in 'bounds' represents a startAt/endAt pair. We have to issue
			// a separate query for each pair. There can be up to 9 pairs of bounds
			// depending on overlap, but in most cases there are 4.
			const bounds = geofire.geohashQueryBounds(center, radiusInM);
			const promises = [];
			const collectionref = collection(db, 'stations');
			for (const b of bounds) {
				const q = query(collectionref, orderBy('geohash'), startAt(b[0]), endAt(b[1]));
				promises.push(getDocs(q));
			}
			console.log(bounds.length);
			// console.log(promises);
			// Collect all the query results together into a single list
			Promise.all(promises).then((snapshots) => {
				const matchingDocs = [];
			
				for (const snap of snapshots) {
				for (const doc of snap.docs) {
					const geopoint = doc.get('geopoint');
					const lat = geopoint.latitude;
					const lng = geopoint.longitude;
			
					// We have to filter out a few false positives due to GeoHash
					// accuracy, but most will match
					const distanceInKm = geofire.distanceBetween([lat,lng], center);
					const distanceInM = distanceInKm * 1000;
					if (distanceInM <= radiusInM) {
					matchingDocs.push(doc);
					}
				}
				}
			
				return matchingDocs;
			}).then((matchingDocs) => {
				// Process the matching documents
				// ...
				var geopoint;
				for (const doc of matchingDocs){
					var data = doc.data();
					// geopoint = doc.get('geopoint');
					geopoint = data.geopoint;
					const lat = geopoint.latitude;
					const lng = geopoint.longitude;
					const distanceInKm = geofire.distanceBetween([lat,lng], center);
					// console.log(`name: ${doc.get('name')}, distance: ${distanceInKm} km, location: ${[lat,lng]}`);
					console.log(`username: ${data.username}, distance: ${distanceInKm} km, location: ${[lat,lng]}`);
				}
				res.status(200).send(matchingDocs);
			}).catch((err) => {
				console.log("doc processing error: "+err);
				res.status(500).json({err: String(err)});
			});

			
		} catch (error) {
			console.log(error);
			res.status(500).json({err: String(error)});
		}
	}
}