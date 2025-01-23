//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_X } from "@/src/components/1_grouped/icons/icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export function SharedVocabBack_BTNS({
  list,
  SAVE_vocab,
  TOGGLE_vocab,
}: {
  list?:
    | {
        name: string | undefined;
        id: string | undefined;
      }
    | undefined;
  SAVE_vocab: () => void;
  TOGGLE_vocab: () => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <View style={{ gap: 8, padding: 12 }}>
      <Btn
        iconLeft={<ICON_X color="primary" />}
        type="simple_primary_text"
        text={t("btn.saveVocabToList")}
        onPress={SAVE_vocab}
      />

      {list && list?.name && list?.id && (
        <Btn
          text={`See list "${list.name}"`}
          onPress={() => router.push(`/(main)/explore/public_lists/${list.id}`)}
        />
      )}

      <Btn text={t("btn.close")} onPress={TOGGLE_vocab} />
    </View>
  );
}
