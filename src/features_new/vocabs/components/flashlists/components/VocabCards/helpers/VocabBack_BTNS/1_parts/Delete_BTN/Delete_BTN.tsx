//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_delete,
  ICON_difficultyDot,
} from "@/src/components/1_grouped/icons/icons";
import { MyColors } from "@/src/constants/MyColors";
import { USE_hardDeleteVocab } from "@/src/features_new/vocabs/hooks/actions/USE_hardDeleteVocab/USE_hardDeleteVocab";
import { USE_softDeletevocab } from "@/src/features_new/vocabs/hooks/actions/USE_softDeletevocab/USE_softDeletevocab";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { t } from "i18next";
import { memo, useMemo } from "react";
import { ActivityIndicator } from "react-native";

type props = {
  vocab: Vocab_TYPE;
  delete_TYPE: "soft" | "hard";
};

export const Delete_BTN = memo(({ vocab, delete_TYPE = "soft" }: props) => {
  const { z_currentActions, IS_inAction } = z_USE_currentActions();
  const { SOFTDELETE_vocab } = USE_softDeletevocab();
  const { HARDDELETE_vocab } = USE_hardDeleteVocab();

  const IS_deleting = useMemo(
    () => IS_inAction("vocab", vocab?.id, "deleting"),
    [z_currentActions]
  );

  const text = useMemo(
    () =>
      IS_deleting
        ? ""
        : delete_TYPE === "soft"
        ? t("btn.deleteVocab")
        : t("btn.deleteVocabHard"),
    [delete_TYPE, IS_deleting]
  );

  return (
    <Btn
      type="delete"
      onPress={async () => {
        delete_TYPE === "hard"
          ? await HARDDELETE_vocab(vocab?.id)
          : await SOFTDELETE_vocab(vocab?.id, vocab?.list_id, true);
      }}
      text={text}
      text_STYLES={{ marginRight: "auto" }}
      stayPressed={IS_deleting}
      style={[
        { flex: 1 },
        !IS_deleting && { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
      ]}
      iconRight={
        IS_deleting ? (
          <ActivityIndicator color={MyColors.icon_red} />
        ) : (
          <ICON_delete />
        )
      }
    />
  );
});
