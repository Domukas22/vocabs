//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { StyleSheet, View } from "react-native";

import { USE_toggle } from "@/src/hooks/USE_toggle";
import { DisplaySettings_PROPS, tr_PROPS } from "@/src/db/props";

import Vocab_FRONT from "../Components/Vocab_FRONT/Vocab_FRONT";
import { VocabBack_TRS } from "../Components/VocabBack_TRS/VocabBack_TRS";
import VocabBack_DESC from "../Components/VocabBack_DESC/VocabBack_DESC";
import Btn from "@/src/components/Btn/Btn";
import { useTranslation } from "react-i18next";
import { ICON_X } from "@/src/components/icons/icons";
import { withObservables } from "@nozbe/watermelondb/react";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";

interface VocabProps {
  vocab: Vocab_MODEL | undefined;
  trs: tr_PROPS[];
  displaySettings: DisplaySettings_PROPS;
  highlighted?: boolean;
  IS_admin: boolean;
  HANDLE_updateModal: ({
    clear,
    vocab,
  }: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
  }) => void;
  PREPARE_toSaveVocab: ({
    vocab,
    trs,
  }: {
    vocab: Vocab_MODEL;
    trs: tr_PROPS[];
  }) => void;
}

// TOGGLE_vocabModal needs to also pass in th etranslations, so we dont have to pass them async and get a delayed manageVocabModal update
function _Public_VOCAB({
  vocab,
  trs,
  displaySettings,
  IS_admin = false,
  HANDLE_updateModal,
  PREPARE_toSaveVocab,
  highlighted,
}: VocabProps) {
  const [open, TOGGLE_open] = USE_toggle(false);
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
        {!open && (
          <Vocab_FRONT
            trs={trs}
            difficulty={0}
            description={vocab?.description}
            displaySettings={displaySettings}
            highlighted={highlighted}
            TOGGLE_open={TOGGLE_open}
          />
        )}
        {open && (
          <>
            <VocabBack_TRS trs={trs} difficulty={0} />
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
                    HANDLE_updateModal({ vocab });
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
                onPress={() => PREPARE_toSaveVocab({ vocab, trs })}
                text={t("btn.saveVocabToList")}
                text_STYLES={{ textAlign: "center" }}
              />

              <Btn
                type="simple"
                onPress={TOGGLE_open}
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

const enhance = withObservables(
  ["vocab"],
  ({ vocab }: { vocab: Vocab_MODEL }) => ({
    trs: vocab.translations,
  })
);

export const Public_VOCAB = enhance(_Public_VOCAB);

const s = StyleSheet.create({
  vocab: {
    borderRadius: 12,
    backgroundColor: MyColors.btn_2,
    borderWidth: 1,
    borderColor: MyColors.border_white_005,
    overflow: "hidden",
    width: "100%",
    minWidth: "100%",
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
