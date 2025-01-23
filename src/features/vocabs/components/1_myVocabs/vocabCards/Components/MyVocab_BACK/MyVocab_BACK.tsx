//
//
//

import { useTranslation } from "react-i18next";

import { View } from "react-native";

export default function MyVocab_BACK({
  TOGGLE_vocab,
}: {
  TOGGLE_vocab: () => void;
}) {
  const { t } = useTranslation();
  return (
    <View style={{ gap: 8, padding: 12 }}>
      {/* ---------------- TODO ------------------ */}
      {/* <Btn
        iconLeft={<ICON_X color="primary" />}
        type="simple_primary_text"
        text={t("btn.saveVocabToList")}
        onPress={() => {}}
      />
      <Btn text={t("btn.close")} onPress={TOGGLE_vocab} /> */}
    </View>
  );
}
