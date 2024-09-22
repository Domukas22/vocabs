import { LanguagesProvider } from "@/src/context/AllLangs_CONTEXT";
import { Langs_PROVIDER } from "@/src/context/Langs_CONTEXT";
import { SelectedList_PROVIDER } from "@/src/context/SelectedList_CONTEXT";
import { Stack } from "expo-router";

export default function VocabsTab_LAYOUT() {
  return (
    <Langs_PROVIDER>
      <SelectedList_PROVIDER>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </SelectedList_PROVIDER>
    </Langs_PROVIDER>
  );
}