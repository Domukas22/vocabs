//
//
//

import BigPage_BTN from "@/src/components/1_grouped/buttons/BigPage_BTN/BigPage_BTN";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { View } from "react-native";

export function VocabPageBigMain_BTNS({
  totalSavedVocab_COUNT = 0,
  totalUserVocab_COUNT = 0,
  deletedUserVocab_COUNT = 0,
  NAVIGATE_toMarkedVocabs = () => {},
  NAVIGATE_toAllVocabs = () => {},
  NAVIGATE_toDeletedVocabs = () => {},
}: {
  totalSavedVocab_COUNT: number | undefined;
  totalUserVocab_COUNT: number | undefined;
  deletedUserVocab_COUNT: number | undefined;
  NAVIGATE_toMarkedVocabs: () => void;
  NAVIGATE_toAllVocabs: () => void;
  NAVIGATE_toDeletedVocabs: () => void;
}) {
  return (
    <View style={{ padding: 12, gap: 12, paddingBottom: 36 }}>
      {/* <Label>My vocabs</Label> */}

      <BigPage_BTN
        title="⭐ Saved vocabs"
        description={`${totalSavedVocab_COUNT} vocabs saved`}
        onPress={NAVIGATE_toMarkedVocabs}
      />
      <BigPage_BTN
        title="🅿️ All my vocabs"
        description={`${totalUserVocab_COUNT} vocabs in total`}
        onPress={NAVIGATE_toAllVocabs}
      />

      <BigPage_BTN
        title="🗑️ Deleted vocabs"
        description={`${deletedUserVocab_COUNT} deleted vocabs`}
        onPress={NAVIGATE_toDeletedVocabs}
      />
    </View>
  );
}
