"use client";
import { create } from "zustand";
import { Profile } from "../(account)/type";

export const useProfileStore = create<{
	profile: null | Profile;
	setProfile: (profile: Profile) => void;
	resetProfile: () => void;
}>((set) => ({
	profile: null,
	setProfile: (profile) => set({ profile }),
	resetProfile: () => set({ profile: null }),
}));
