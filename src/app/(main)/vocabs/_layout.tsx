//
//
//

import { SelectedList_PROVIDER } from "@/src/context/SelectedList_CONTEXT";
import { Stack } from "expo-router";

export default function VocabsTab_LAYOUT() {
  return (
    <SelectedList_PROVIDER>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </SelectedList_PROVIDER>
  );
}
