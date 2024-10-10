//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_difficultyDot } from "@/src/components/icons/icons";
import { Vocab_PROPS } from "@/src/db/props";
import { Translation_MODEL, Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

//
export default function VocabBack_BTNS({
  vocab,

  TOGGLE_vocab,
  editBtn_FN,
  TOGGLE_difficultyEdits,
}: {
  vocab: Vocab_MODEL;
  TOGGLE_vocab: () => void;
  TOGGLE_difficultyEdits: () => void;
  editBtn_FN: () => void;
}) {
  const { t } = useTranslation();
  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <Btn
        type="simple"
        style={{ flex: 1 }}
        onPress={editBtn_FN}
        text={t("btn.editVocab")}
        text_STYLES={{ textAlign: "center" }}
      />

      <Btn type="simple" onPress={TOGGLE_vocab} text={t("btn.close")} />

      <Btn
        type="simple"
        onPress={TOGGLE_difficultyEdits}
        iconLeft={
          vocab?.difficulty && (
            <ICON_difficultyDot difficulty={vocab.difficulty} big={true} />
          )
        }
      />
    </View>
  );
}
