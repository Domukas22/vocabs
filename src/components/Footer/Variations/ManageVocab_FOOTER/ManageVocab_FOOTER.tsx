//
//
//

import Btn from "@/src/components/Btn/Btn";
import Footer from "../../Footer";
import { ActivityIndicator } from "react-native";

interface ManageVocabFooter_PROPS {
  onCancelPress: () => void;
  onActionPress: () => void;
  loading: boolean;
  btnText: string;
}

export default function ManageVocab_FOOTER({
  onCancelPress,
  onActionPress,
  loading,
  btnText,
}: ManageVocabFooter_PROPS) {
  return (
    <Footer
      btnLeft={<Btn text="Cancel" onPress={onCancelPress} type="simple" />}
      btnRight={
        <Btn
          text={!loading ? btnText : ""}
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
