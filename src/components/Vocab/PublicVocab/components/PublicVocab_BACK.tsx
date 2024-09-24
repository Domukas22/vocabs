//
//
//

import { MyColors } from "@/src/constants/MyColors";
import {
  PublicVocab_MODEL,
  Translation_MODEL,
  Vocab_MODEL,
} from "@/src/db/models";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import Btn from "../../../Btn/Btn";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import languages from "@/src/constants/languages";
import { Styled_TEXT } from "../../../Styled_TEXT/Styled_TEXT";
import RENDER_textWithHighlights from "../../../RENDER_textWithHighlights/RENDER_textWithHighlights";
import { ICON_difficultyDot, ICON_flag, ICON_X } from "../../../icons/icons";

import USE_editVocabDifficulty from "@/src/db/vocabs/EDIT_vocabDifficulty";
import { useTranslation } from "react-i18next";
import VocabBack_TRs from "../../forBothVocabs/VocabBack_TRs";
import VocabBack_DESC from "../../forBothVocabs/VocabBack_DESC";

interface PublicVocabBack_PROPS {
  vocab: PublicVocab_MODEL;
  TOGGLE_vocab: () => void;
  HANDLE_vocabModal: ({
    clear,
    vocab,
  }: {
    clear?: boolean;
    vocab?: PublicVocab_MODEL;
  }) => void;
  IS_admin: boolean;
  PREPARE_toSaveVocab: (vocab: Vocab_MODEL) => void;
}

export default function PublicVocab_BACK({
  vocab,
  TOGGLE_vocab,
  HANDLE_vocabModal,
  IS_admin = false,
  PREPARE_toSaveVocab,
}: PublicVocabBack_PROPS) {
  const { t } = useTranslation();

  return (
    <View>
      <VocabBack_TRs TRs={vocab.public_translations} difficulty={0} />
      <VocabBack_DESC desc={vocab.description} />

      <View
        style={{
          padding: 12,
          gap: 8,
        }}
      >
        {IS_admin && (
          <Btn
            type="simple"
            style={{ flex: 1 }}
            onPress={() => {
              HANDLE_vocabModal({ vocab });
            }}
            text={t("btn.editVocabAsAdmin")}
            text_STYLES={{ textAlign: "center", color: MyColors.fill_green }}
          />
        )}
        <Btn
          iconLeft={<ICON_X color="primary" />}
          type="simple_primary_text"
          style={{ flex: 1 }}
          onPress={() => PREPARE_toSaveVocab(vocab)}
          text={t("btn.saveVocabToList")}
          text_STYLES={{ textAlign: "center" }}
        />

        <Btn
          type="simple"
          onPress={TOGGLE_vocab}
          text={t("btn.close")}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}
