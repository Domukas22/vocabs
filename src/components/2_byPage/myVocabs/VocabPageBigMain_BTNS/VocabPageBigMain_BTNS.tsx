//
//
//

import BigPage_BTN from "@/src/components/1_grouped/buttons/BigPage_BTN/BigPage_BTN";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { USE_routerPush } from "@/src/hooks";
import { starterContentLoading_TYPE } from "@/src/types/general_TYPES";
import { t } from "i18next";
import { useMemo } from "react";
import { View } from "react-native";

export function VocabPageBigMain_BTNS({
  savedVocab_COUNT = 0,
  allVocab_COUNT = 0,
  deletedVocab_COUNT = 0,
  loading = "none",
}: {
  savedVocab_COUNT: number;
  allVocab_COUNT: number;
  deletedVocab_COUNT: number;
  loading: starterContentLoading_TYPE;
}) {
  const { PUSH_router } = USE_routerPush();
  const IS_loading = useMemo(() => loading !== "none", [loading]);

  return (
    <View style={{ padding: 12, gap: 12, paddingBottom: 36 }}>
      <Styled_TEXT type="text_22_bold">{t("label.myVocabs")}</Styled_TEXT>
      <BigPage_BTN
        IS_loading={IS_loading}
        title={t("listName.savedVocabs")}
        description={`${savedVocab_COUNT} vocabs saved`}
        onPress={() => PUSH_router("saved-vocabs")}
      />
      <BigPage_BTN
        IS_loading={IS_loading}
        title={t("listName.allMyVocabs")}
        description={`${allVocab_COUNT} vocabs in total`}
        onPress={() => PUSH_router("all-my-vocabs")}
      />

      <BigPage_BTN
        IS_loading={IS_loading}
        title={t("listName.deletedVocabs")}
        description={`${deletedVocab_COUNT} deleted vocabs`}
        onPress={() => PUSH_router("deleted-vocabs")}
      />
    </View>
  );
}
