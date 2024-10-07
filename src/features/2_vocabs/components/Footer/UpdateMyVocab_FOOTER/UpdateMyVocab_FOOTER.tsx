//
//
//

import Btn from "@/src/components/Btn/Btn";
import Footer from "@/src/components/Footer/Footer";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { t } from "i18next";
import { View, ActivityIndicator } from "react-native";

interface CreateMyVocabFooter_PROPS {
  IS_updatingVocab: boolean;
  db_ERROR: string | null;
  CANCEL_creation: () => void;
  submit: () => void;
}

export default function UpdateMyVocab_FOOTER({
  IS_updatingVocab,
  db_ERROR,
  submit,
  CANCEL_creation,
}: CreateMyVocabFooter_PROPS) {
  return (
    <Footer
      contentAbove={
        db_ERROR && (
          <View
            style={{
              paddingTop: 8,
              paddingHorizontal: 12,
              width: "100%",
            }}
          >
            <Styled_TEXT type="text_error">{db_ERROR}</Styled_TEXT>
          </View>
        )
      }
      btnLeft={
        <Btn text={t("btn.cancel")} onPress={CANCEL_creation} type="simple" />
      }
      btnRight={
        <Btn
          text={!IS_updatingVocab ? t("btn.updateButtonAction") : ""}
          iconRight={IS_updatingVocab && <ActivityIndicator color={"black"} />}
          onPress={submit}
          stayPressed={IS_updatingVocab}
          type="action"
          style={{ flex: 1 }}
        />
      }
    />
  );
}
