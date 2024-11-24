//
//
//

import Btn from "@/src/components/Btn/Btn";
import Footer from "@/src/components/Footer/Footer";
import i18next, { t } from "i18next";
import { ActivityIndicator } from "react-native";

import { useMemo } from "react";

interface SelectUsersModalFooter_PROPS {
  selected_COUNT: number;
  IS_inAction?: boolean | undefined;
  cancel: () => void;
  submit: () => void;
}

export default function SelectUsersModal_FOOTER({
  selected_COUNT,
  IS_inAction,
  cancel,
  submit,
}: SelectUsersModalFooter_PROPS) {
  const appLang = useMemo(() => i18next.language, []);
  return (
    <Footer
      btnLeft={
        <Btn
          text={t("btn.cancel")}
          onPress={() => {
            if (!IS_inAction) cancel();
          }}
          style={{ height: 48, paddingVertical: 0 }}
        />
      }
      btnRight={
        <Btn
          text={
            !IS_inAction
              ? appLang === "en"
                ? `Select ${selected_COUNT} users`
                : `${selected_COUNT} Nutzer wählen`
              : ""
          }
          onPress={() => {
            if (!IS_inAction) submit();
          }}
          iconRight={IS_inAction ? <ActivityIndicator color="black" /> : null}
          type="action"
          style={{ flex: 1, height: 48, paddingVertical: 0 }}
          stayPressed={IS_inAction} // Add this only if you want the button to stay pressed
        />
      }
    />
  );
}
