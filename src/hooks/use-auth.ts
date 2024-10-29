import { UserLogin } from "@/types/user";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type UserState = {
    user: UserLogin | null;
    setUser: (user: UserLogin) => void;
    clearUser: () => void;
};

export const useAuth = create<UserState>()(
    persist(
        immer((set) => ({
            user: null,
            setUser: (user: UserLogin) => {
                set((state) => {
                    state.user = user;
                });
            },
            clearUser: () => {
                set((state) => {
                    state.user = null;
                });
            },
        })),
        {
            name: "user",
            storage: createJSONStorage(() => sessionStorage),
            onRehydrateStorage() {
                return (state, error) => {
                    if (error) {
                        (state as UserState).clearUser();
                    }
                };
            },
        },
    ),
);
