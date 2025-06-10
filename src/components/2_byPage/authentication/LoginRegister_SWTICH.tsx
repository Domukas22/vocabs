//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_arrow2 } from "@/src/components/1_grouped/icons/icons";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { useRouter } from "expo-router";

import { useTranslation } from "react-i18next";

export default function LoginRegister_SWITCH({
  page = "register",
}: {
  page: "login" | "register";
}) {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Block
      styles={{ marginTop: "auto", borderTopWidth: 1, paddingBottom: 16 }}
      noBorder
    >
      <Styled_TEXT type="text_18_regular">
        {page === "login"
          ? t("label.noAccountYet")
          : t("label.alreadyHaveAccount")}
      </Styled_TEXT>
      <Btn
        text={page === "login" ? t("btn.goToRegister") : t("btn.goToLogIn")}
        onPress={() =>
          page === "login" ? router.push("/register") : router.push("/login")
        }
        iconRight={<ICON_arrow2 direction="right" />}
        text_STYLES={{ flex: 1 }}
      />
    </Block>
  );
}
