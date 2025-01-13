import { serverFetch } from "@/utils/serverFetch";
import { Profile } from "./type";

export async function getProfile() {
	const [response, error] = await serverFetch("/profile");
	if (error) {
		throw new Error("Error fetching profile");
	}
	return response as Profile;
}
