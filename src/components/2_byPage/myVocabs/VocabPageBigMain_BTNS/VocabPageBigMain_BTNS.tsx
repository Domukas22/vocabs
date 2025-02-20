//
//
//

import BigPage_BTN from "@/src/components/1_grouped/buttons/BigPage_BTN/BigPage_BTN";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { USE_routerPush } from "@/src/hooks";
import { z_USE_myStarterContent } from "@/src/hooks/zustand/z_USE_myStarterContent/z_USE_myStarterContent";
import { View } from "react-native";

export function VocabPageBigMain_BTNS() {
  const { PUSH_router } = USE_routerPush();

  const {
    z_IS_myStarterInitialFetchDone,
    z_myStarterSavedVocab_COUNT,
    z_myStarterAllVocab_COUNT,
    z_myStarterDeletedVocab_COUNT,
  } = z_USE_myStarterContent();

  return (
    <View style={{ padding: 12, gap: 12, paddingBottom: 36 }}>
      <BigPage_BTN
        IS_loading={!z_IS_myStarterInitialFetchDone}
        title="⭐ Saved vocabs"
        description={`${z_myStarterSavedVocab_COUNT} vocabs saved`}
        onPress={() => PUSH_router("saved-vocabs")}
      />
      <BigPage_BTN
        IS_loading={!z_IS_myStarterInitialFetchDone}
        title="🅿️ All my vocabs"
        description={`${z_myStarterAllVocab_COUNT} vocabs in total`}
        onPress={() => PUSH_router("all-my-vocabs")}
      />

      <BigPage_BTN
        IS_loading={!z_IS_myStarterInitialFetchDone}
        title="🗑️ Deleted vocabs"
        description={`${z_myStarterDeletedVocab_COUNT} deleted vocabs`}
        onPress={() => PUSH_router("deleted-vocabs")}
      />
    </View>
  );
}
