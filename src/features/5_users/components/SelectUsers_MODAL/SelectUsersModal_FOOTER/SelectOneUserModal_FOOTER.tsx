//
//
//

import Btn from "@/src/components/Btn/Btn";
import Footer from "@/src/components/Footer/Footer";
import i18next, { t } from "i18next";
import { ActivityIndicator } from "react-native";

import { User_MODEL } from "@/src/db/watermelon_MODELS";
import { useMemo } from "react";
import { map } from "@nozbe/watermelondb/utils/rx";
import { FetchedUsers_PROPS } from "@/src/features/1_lists/hooks/USE_supabaseUsers_2";

interface SelectUsersModalFooter_PROPS {
  selected_USER: FetchedUsers_PROPS | undefined;
  cancel: () => void;
  submit: (user: FetchedUsers_PROPS) => void;
}

export default function SelectOneUserModal_FOOTER({
  selected_USER,
  cancel,
  submit,
}: SelectUsersModalFooter_PROPS) {
  const appLang = useMemo(() => i18next.language, []);
  return (
    <Footer
      btnLeft={
        <Btn
          text={t("btn.cancel")}
          onPress={cancel}
          style={[
            { height: 48, paddingVertical: 0 },
            !selected_USER && { flex: 1 },
          ]}
        />
      }
      btnRight={
        selected_USER ? (
          <Btn
            text={
              appLang === "en"
                ? `Select '${selected_USER.username}'`
                : `'${selected_USER.username}' wählen`
            }
            onPress={() => (selected_USER ? submit(selected_USER) : {})}
            // iconRight={IS_inAction ? <ActivityIndicator color="black" /> : null}
            type="action"
            style={{ flex: 1, height: 48, paddingVertical: 0 }}
            // stayPressed={IS_inAction} // Add this only if you want the button to stay pressed
          />
        ) : null
      }
    />
  );
}
