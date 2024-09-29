//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_difficultyDot } from "@/src/components/icons/icons";
import { Vocab_MODEL } from "@/src/db/models";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

//
export default function MyVocabBack_BTNS({
  vocab,
  TOGGLE_vocab,
  HANDLE_vocabModal,
  TOGGLE_difficultyEdits,
}: {
  vocab: Vocab_MODEL;
  TOGGLE_vocab: () => void;
  TOGGLE_difficultyEdits: () => void;
  HANDLE_vocabModal: (vocab: Vocab_MODEL) => void;
}) {
  const { t } = useTranslation();
  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <Btn
        type="simple"
        style={{ flex: 1 }}
        onPress={() => {
          HANDLE_vocabModal({ vocab });
        }}
        text={t("btn.editVocab")}
        text_STYLES={{ textAlign: "center" }}
      />

      <Btn type="simple" onPress={TOGGLE_vocab} text={t("btn.close")} />

      <Btn
        type="simple"
        onPress={TOGGLE_difficultyEdits}
        iconLeft={
          <ICON_difficultyDot difficulty={vocab.difficulty} big={true} />
        }
      />
    </View>
  );
}
