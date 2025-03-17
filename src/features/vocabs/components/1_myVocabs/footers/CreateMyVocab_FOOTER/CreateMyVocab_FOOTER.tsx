//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import TwoBtn_BLOCK from "@/src/components/1_grouped/blocks/TwoBtn_BLOCK/TwoBtn_BLOCK";
import { t } from "i18next";
import { View, ActivityIndicator } from "react-native";
import Error_TEXT from "@/src/components/1_grouped/texts/Error_TEXT/Error_TEXT";

interface CreateMyVocabFooter_PROPS {
  IS_creatingVocab: boolean;
  dbError_MSG: string | undefined;
  CANCEL_creation: () => void;
  submit: () => void;
}

export function CreateMyVocab_FOOTER({
  IS_creatingVocab,
  dbError_MSG = "",
  submit,
  CANCEL_creation,
}: CreateMyVocabFooter_PROPS) {
  return (
    <TwoBtn_BLOCK
      contentAbove={
        dbError_MSG && (
          <View
            style={{
              paddingTop: 8,
              paddingHorizontal: 12,
              width: "100%",
            }}
          >
            <Error_TEXT text={dbError_MSG} />
          </View>
        )
      }
      btnLeft={
        <Btn text={t("btn.cancel")} onPress={CANCEL_creation} type="simple" />
      }
      btnRight={
        <Btn
          text={!IS_creatingVocab ? t("btn.createButtonAction") : ""}
          iconRight={IS_creatingVocab && <ActivityIndicator color={"black"} />}
          onPress={submit}
          stayPressed={IS_creatingVocab}
          type="action"
          style={{ flex: 1 }}
        />
      }
    />
  );
}
