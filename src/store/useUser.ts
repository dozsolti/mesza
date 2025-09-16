import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types";

type UserState = {
  user: User;
};

type UserActions = {
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set) => ({
      user: { name: "" },
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: { name: "" } }),
    }),
    {
      name: "user-storage",
    }
  )
);
