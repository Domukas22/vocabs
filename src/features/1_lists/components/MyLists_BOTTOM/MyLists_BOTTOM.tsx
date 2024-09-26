//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_X } from "@/src/components/icons/icons";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export default function MyLists_BOTTOM({ search, TOGGLE_createListModal }) {
  const { t } = useTranslation();

  return (
    <View style={{ padding: 12, gap: 12 }}>
      <View
        style={{
          borderWidth: 1,
          borderColor: MyColors.border_white_005,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 24,
          borderRadius: 12,
        }}
      >
        <Styled_TEXT style={{ color: MyColors.text_white_06 }}>
          {search === ""
            ? t("label.youDontHaveAnyLists")
            : t("label.noListsFound")}
        </Styled_TEXT>
      </View>
      {search === "" && (
        <Btn
          text={t("btn.createList")}
          iconLeft={<ICON_X color="primary" />}
          type="seethrough_primary"
          onPress={TOGGLE_createListModal}
        />
      )}
    </View>
  );
}
