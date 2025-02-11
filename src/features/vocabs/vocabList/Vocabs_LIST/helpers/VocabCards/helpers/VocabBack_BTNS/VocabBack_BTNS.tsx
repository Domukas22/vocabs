//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_bookmark_2,
  ICON_difficultyDot,
} from "@/src/components/1_grouped/icons/icons";

import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { useToast } from "react-native-toast-notifications";

//
export default function VocabBack_BTNS({
  vocab,
  editBtn_FN,
  TOGGLE_difficultyEdits,
}: {
  vocab: Vocab_MODEL;

  TOGGLE_difficultyEdits: () => void;

  editBtn_FN: () => void;
}) {
  const { t } = useTranslation();
  const toast = useToast();

  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Btn
          type="simple"
          style={{ flex: 1 }}
          onPress={editBtn_FN}
          text={t("btn.editVocab")}
          text_STYLES={{ textAlign: "center" }}
        />

        <Btn
          type={vocab?.is_marked ? "active_green" : "simple"}
          onPress={() => {
            (async () => {
              await vocab.TOGGLE_marked();
              if (vocab?.is_marked === true) {
                // only show when marked, dont show when unmarked
                toast.show(t("notifications.markedVocab"), {
                  type: "success",
                  duration: 2000,
                });
              }
            })();
          }}
          iconLeft={<ICON_bookmark_2 big active={vocab?.is_marked} />}
        />

        <Btn
          type="simple"
          onPress={TOGGLE_difficultyEdits}
          iconLeft={
            vocab?.difficulty && (
              <ICON_difficultyDot difficulty={vocab.difficulty} big={true} />
            )
          }
        />
      </View>
    </View>
  );
}
