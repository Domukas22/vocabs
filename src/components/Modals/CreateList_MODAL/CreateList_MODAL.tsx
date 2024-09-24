//
//
//

import { useState } from "react";
import Btn from "../../Btn/Btn";
import { Styled_TEXT } from "../../Styled_TEXT/Styled_TEXT";
import StyledText_INPUT from "../../StyledText_INPUT/StyledText_INPUT";
import Simple_MODAL from "../Simple_MODAL/Simple_MODAL";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import CREATE_list from "@/src/db/lists/CREATE_list";
import { useTranslation } from "react-i18next";

interface CreateListModal_PROPS {
  open: boolean;
  toggle: () => void;
}

export default function CreateList_MODAL({
  open,
  toggle,
}: CreateListModal_PROPS) {
  const [newList_NAME, SET_newListName] = useState("");
  const { user } = USE_auth();
  const { t } = useTranslation();

  const create = async () => {
    if (!newList_NAME || !user.id) return;
    await CREATE_list({ name: newList_NAME, user_id: user.id });
    HANLDE_toggle();
  };

  function HANLDE_toggle() {
    SET_newListName("");
    toggle();
  }

  return (
    <Simple_MODAL
      title={t("btn.createList")}
      open={open}
      toggle={toggle}
      btnLeft={<Btn text={t("btn.cancel")} onPress={HANLDE_toggle} />}
      btnRight={
        <Btn
          text={t("btn.create")}
          type="action"
          style={{ flex: 1 }}
          onPress={create}
        />
      }
    >
      <Styled_TEXT type="label">{t("label.createList")}</Styled_TEXT>
      <StyledText_INPUT
        value={newList_NAME}
        SET_value={SET_newListName}
        placeholder={t("other.createListPlaceholder")}
      />
    </Simple_MODAL>
  );
}
