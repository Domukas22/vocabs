//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_X } from "@/src/components/icons/icons";
import { List_MODEL, Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { View } from "react-native";

export default function PublicVocab_BACK({
  list,
  SAVE_vocab,
  TOGGLE_vocab,
}: {
  list: List_MODEL | undefined;
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

      {list && (
        <Btn
          text={`See list "${list.name}"`}
          onPress={() =>
            router.push(`/(main)/explore/public_lists/${list.name}`)
          }
        />
      )}

      <Btn text={t("btn.close")} onPress={TOGGLE_vocab} />
    </View>
  );
}
