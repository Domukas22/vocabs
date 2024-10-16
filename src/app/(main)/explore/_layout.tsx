import { SelectedList_PROVIDER } from "@/src/context/SelectedList_CONTEXT";
import { Stack } from "expo-router";

export default function ExploreTab_LAYOUT() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
