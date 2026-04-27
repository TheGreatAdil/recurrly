import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SubscriptionState {
  subscriptions: Subscription[];
  addSubscription: (sub: Subscription) => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      subscriptions: HOME_SUBSCRIPTIONS,
      addSubscription: (sub) =>
        set((state) => ({ subscriptions: [sub, ...state.subscriptions] })),
    }),
    {
      name: "subscription-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
