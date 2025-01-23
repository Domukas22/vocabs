//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import TwoBtn_BLOCK from "@/src/components/1_grouped/blocks/TwoBtn_BLOCK/TwoBtn_BLOCK";
import i18next, { t } from "i18next";

import { useMemo } from "react";
import { FetchedUsers_PROPS } from "@/src/features/users/functions/fetch/hooks/USE_supabaseUsers/USE_supabaseUsers_2";

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
    <TwoBtn_BLOCK
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
