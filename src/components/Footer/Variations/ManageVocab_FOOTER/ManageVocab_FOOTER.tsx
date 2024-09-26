//
//
//

import Btn from "@/src/components/Btn/Btn";
import Footer from "../../Footer";
import { ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";

interface ManageVocabFooter_PROPS {
  onCancelPress: () => void;
  onActionPress: () => void;
  loading: boolean;
  actionBtnText: string;
}

export default function ManageVocab_FOOTER({
  onCancelPress,
  onActionPress,
  loading,
  actionBtnText,
}: ManageVocabFooter_PROPS) {
  const { t } = useTranslation();
  return (
    <Footer
      btnLeft={
        <Btn text={t("btn.cancel")} onPress={onCancelPress} type="simple" />
      }
      btnRight={
        <Btn
          text={!loading ? actionBtnText : ""}
          iconRight={loading ? <ActivityIndicator color={"black"} /> : null}
          onPress={() => {
            if (!loading) onActionPress();
          }}
          stayPressed={loading}
          type="action"
          style={{ flex: 1 }}
        />
      }
    />
  );
}
