"use server";
import { serverFetch } from "@/utils/serverFetch";
import { User, UserCreateDto } from "./types";

export async function getUsers() {
	try {
		const [data, error] = await serverFetch<User[]>("/users");

		if (error) {
			throw new Error(String(error));
		}

		return data;
	} catch (error) {
		throw new Error(String(error));
	}
}
export async function createUser(data: UserCreateDto) {
	try {
		const [response, error] = await serverFetch<User>("/users", {
			method: "POST",
			body: JSON.stringify(data),
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (error) {
			throw new Error(String(error));
		}

		return response;
	} catch (error) {
		throw new Error(String(error));
	}
}
