import { useContext } from "react";
import { storage, db } from "../services/database";
import authContext from "../context/auth/authContext";

export const saveOrChangeImageToDatabase = async (result) => {
	const { user } = useContext(authContext);
	try {
		const { uri } = result;
		const ext = uri.split(".").pop();
		const filename = user.id + "-profile" + "." + ext;
		const response = await fetch(uri);
		const blob = await response.blob();

		const ref = storage
			.ref(`profile/${filename}`)
			.put(blob, { contentType: "image/jpeg" });

		ref.on(
			"state_changed",
			(s) => {
				let progress = (s.bytesTransferred / s.totalBytes) * 100;
			},
			(error) => {
				console.log(error);
			},
			async () => {
				const imageUrl = await ref.snapshot.ref.getDownloadURL();
				if (imageUrl) {
					try {
						await db.collection("appUser").doc(user.id).update({ imageUrl });
					} catch (error) {
						console.log("error saving image to user", error);
					}
				}
			}
		);
	} catch (error) {
		console.log("Error from saving image", error);
	}
};
