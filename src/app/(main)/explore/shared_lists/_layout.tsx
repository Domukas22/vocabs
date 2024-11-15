import { SelectedList_PROVIDER } from "@/src/context/SelectedList_CONTEXT";
import { Stack } from "expo-router";

export default function SharedLists_LAYOUT() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}

// 🔴🔴🔴🔴🔴🔴 TODO  🔴🔴🔴🔴🔴🔴🔴
// make supabase user the time conversion again
