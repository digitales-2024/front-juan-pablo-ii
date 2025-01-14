import { Profile } from "@/app/(auth)/types";
import { serverFetch } from "@/utils/serverFetch";

export async function getProfile() {
	const [response, error] = await serverFetch("/profile");
	if (error) {
		throw new Error("Error fetching profile");
	}
	return response as Profile;
}
