//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { StyleSheet, View } from "react-native";

import {
  Vocab_MODEL,
  List_MODEL,
  Translation_MODEL,
  PublicVocab_MODEL,
  PublicVocabDisplaySettings_PROPS,
} from "@/src/db/models";

import { USE_toggle } from "@/src/hooks/USE_toggle";
import { MyVocabDisplaySettings_PROPS } from "@/src/db/models";

import PublicVocab_BACK from "./components/PublicVocab_BACK";

import Vocab_FRONT from "../components/Vocab_FRONT";
import VocabBack_TRs from "../components/VocabBack_TRs";
import VocabBack_DESC from "../components/VocabBack_DESC";
import Btn from "@/src/components/Btn/Btn";
import { useTranslation } from "react-i18next";
import { ICON_X } from "@/src/components/icons/icons";

interface VocabProps {
  vocab: PublicVocab_MODEL | undefined;
  displaySettings: PublicVocabDisplaySettings_PROPS;
  IS_admin: boolean;
  HANDLE_vocabModal: ({
    clear,
    vocab,
  }: {
    clear?: boolean;
    vocab?: PublicVocab_MODEL;
  }) => void;
  PREPARE_toSaveVocab: (vocab: PublicVocab_MODEL) => void;
}

// TOGGLE_vocabModal needs to also pass in th etranslations, so we dont have to pass them async and get a delayed manageVocabModal update
export default function Public_VOCAB({
  vocab,
  displaySettings,
  IS_admin = false,
  HANDLE_vocabModal,
  PREPARE_toSaveVocab,
}: VocabProps) {
  const [open, TOGGLE_vocab] = USE_toggle(false);
  const { t } = useTranslation();

  return (
    <View
      style={[
        s.vocab,
        open && s.vocab_open,
        open && { borderColor: MyColors.border_primary },
      ]}
    >
      <View>
        <Vocab_FRONT
          vocab_id={vocab?.id}
          translations={vocab?.public_translations}
          difficulty={0}
          description={vocab?.description}
          displaySettings={displaySettings}
          open={open}
          TOGGLE_open={TOGGLE_vocab}
        />
        {open && (
          <>
            <VocabBack_TRs TRs={vocab?.public_translations} difficulty={0} />
            <VocabBack_DESC desc={vocab?.description} />

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
                  text_STYLES={{
                    textAlign: "center",
                    color: MyColors.fill_green,
                  }}
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
          </>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  vocab: {
    borderRadius: 12,
    backgroundColor: MyColors.btn_2,
    borderWidth: 1,
    borderColor: MyColors.border_white_005,
    overflow: "hidden",
  },
  vocab_open: {
    backgroundColor: MyColors.fill_bg,
  },

  bottomTr: {
    flexDirection: "row",
    minHeight: 60,
    borderBottomWidth: 1,
    borderColor: MyColors.border_white_005,
  },
  bottomVocabFlag_WRAP: {
    justifyContent: "center",
    alignItems: "center",
    height: 58,
    width: 50,
  },
  bottomVocab_TITLE: {
    color: MyColors.text_white,
    fontSize: 18,
    fontWeight: 500,
    paddingVertical: 16,
    flex: 1,
  },
  bottomText_WRAP: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: MyColors.border_white_005,
  },
});
