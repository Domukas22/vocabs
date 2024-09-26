//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { Translation_MODEL, Vocab_MODEL } from "@/src/db/models";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import Btn from "@/src/components/Btn/Btn";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import languages from "@/src/constants/languages";

import { ICON_X, ICON_difficultyDot } from "@/src/components/icons/icons";
import USE_editVocabDifficulty from "@/src/db/vocabs/EDIT_vocabDifficulty";
import { useTranslation } from "react-i18next";
import VocabBack_TRs from "../../components/VocabBack_TRs";
import VocabBack_DESC from "../../components/VocabBack_DESC";

interface VocabBack_PROPS {
  vocab: Vocab_MODEL;
  TOGGLE_vocab: () => void;
  HANDLE_vocabModal: ({
    clear,
    vocab,
  }: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
  }) => void;
}

export default function MyVocab_BACK({
  vocab,
  TOGGLE_vocab,
  HANDLE_vocabModal,
}: VocabBack_PROPS) {
  const [SHOW_difficultyEdits, TOGGLE_difficultyEdits] = USE_toggle(false);

  const { EDIT_color, LOADING_colorEdit } = USE_editVocabDifficulty(() =>
    TOGGLE_difficultyEdits()
  );

  const { t } = useTranslation();

  function EDIT_vocabDifficulty(newDifficulty: 1 | 2 | 3) {
    if (!LOADING_colorEdit.loading && vocab.difficulty !== newDifficulty) {
      EDIT_color({ id: vocab.id, newDifficulty });
      // TOGGLE_difficultyEdits();
    }
  }

  return (
    <View>
      <VocabBack_TRs TRs={vocab?.translations} difficulty={vocab.difficulty} />
      <VocabBack_DESC desc={vocab.description} />

      <View
        style={{
          padding: 12,
        }}
      >
        {!SHOW_difficultyEdits && (
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
        )}
        {SHOW_difficultyEdits && (
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Btn
              type={vocab.difficulty === 1 ? "difficulty_1_active" : "simple"}
              style={{ flex: 1 }}
              onPress={() => EDIT_vocabDifficulty(1)}
              iconLeft={
                LOADING_colorEdit.loading &&
                LOADING_colorEdit.difficulty === 1 ? (
                  <ActivityIndicator color={MyColors.icon_difficulty_1} />
                ) : (
                  <ICON_difficultyDot difficulty={1} big={true} />
                )
              }
            />

            <Btn
              type={vocab.difficulty === 2 ? "difficulty_2_active" : "simple"}
              style={{ flex: 1 }}
              onPress={() => EDIT_vocabDifficulty(2)}
              iconLeft={
                LOADING_colorEdit.loading &&
                LOADING_colorEdit.difficulty === 2 ? (
                  <ActivityIndicator color={MyColors.icon_difficulty_2} />
                ) : (
                  <ICON_difficultyDot difficulty={2} big={true} />
                )
              }
            />

            <Btn
              type={vocab.difficulty === 3 ? "difficulty_3_active" : "simple"}
              style={{ flex: 1 }}
              onPress={() => EDIT_vocabDifficulty(3)}
              iconLeft={
                LOADING_colorEdit.loading &&
                LOADING_colorEdit.difficulty === 3 ? (
                  <ActivityIndicator color={MyColors.icon_difficulty_3} />
                ) : (
                  <ICON_difficultyDot difficulty={3} big={true} />
                )
              }
            />
            <Btn
              type="simple"
              onPress={TOGGLE_difficultyEdits}
              iconLeft={<ICON_X big={true} rotate={true} />}
            />
          </View>
        )}
      </View>
    </View>
  );
}
