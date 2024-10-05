//
//
//

import Btn from "@/src/components/Btn/Btn";
import Footer from "@/src/components/Footer/Footer";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { t } from "i18next";
import { View, ActivityIndicator } from "react-native";

interface CreateMyVocabFooter_PROPS {
  IS_creatingVocab: boolean;
  db_ERROR: string | null;
  CANCEL_creation: () => void;
  submit: () => void;
}

export default function CreateMyVocab_FOOTER({
  IS_creatingVocab,
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
