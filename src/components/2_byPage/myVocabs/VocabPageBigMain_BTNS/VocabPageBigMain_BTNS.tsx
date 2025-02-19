//
//
//

import BigPage_BTN from "@/src/components/1_grouped/buttons/BigPage_BTN/BigPage_BTN";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { USE_routerPush } from "@/src/hooks";
import { z_USE_starterContent } from "@/src/hooks/zustand/z_USE_starterContent/z_USE_starterContent";
import { View } from "react-native";

export function VocabPageBigMain_BTNS() {
  const { PUSH_router } = USE_routerPush();

  const {
    z_IS_starterInitialFetchDone,
    z_starterSavedVocab_COUNT,
    z_starterAllVocab_COUNT,
    z_starterDeletedVocab_COUNT,
  } = z_USE_starterContent();

  return (
    <View style={{ padding: 12, gap: 12, paddingBottom: 36 }}>
      <BigPage_BTN
        IS_loading={!z_IS_starterInitialFetchDone}
        title="⭐ Saved vocabs"
        description={`${z_starterSavedVocab_COUNT} vocabs saved`}
        onPress={() => PUSH_router("saved-vocabs")}
      />
      <BigPage_BTN
        IS_loading={!z_IS_starterInitialFetchDone}
        title="🅿️ All my vocabs"
        description={`${z_starterAllVocab_COUNT} vocabs in total`}
        onPress={() => PUSH_router("all-my-vocabs")}
      />

      <BigPage_BTN
        IS_loading={!z_IS_starterInitialFetchDone}
        title="🗑️ Deleted vocabs"
        description={`${z_starterDeletedVocab_COUNT} deleted vocabs`}
        onPress={() => PUSH_router("deleted-vocabs")}
      />
    </View>
  );
}
