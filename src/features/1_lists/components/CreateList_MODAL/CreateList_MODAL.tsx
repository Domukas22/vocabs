//
//
//

import { useState } from "react";
import Btn from "@/src/components/Btn/Btn";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import StyledText_INPUT from "../../../../components/StyledText_INPUT/StyledText_INPUT";
import Small_MODAL from "../../../../components/Modals/Small_MODAL/Small_MODAL";
import { USE_auth } from "@/src/context/Auth_CONTEXT";

import { useTranslation } from "react-i18next";
import USE_createList from "../../utils/CREATE_list";
import { ActivityIndicator } from "react-native";

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

  const { CREATE_list, IS_creatingList, createList_ERROR } = USE_createList();

  const create = async () => {
    if (!newList_NAME || !user?.id) return;
    await CREATE_list({ name: newList_NAME, user_id: user?.id });
    HANLDE_toggle();
  };

  function HANLDE_toggle() {
    SET_newListName("");
    toggle();
  }

  return (
    <Small_MODAL
      title={t("btn.createList")}
      open={open}
      toggle={toggle}
      btnLeft={<Btn text={t("btn.cancel")} onPress={HANLDE_toggle} />}
      btnRight={
        <Btn
          text={!IS_creatingList ? t("btn.create") : ""}
          iconRight={
            IS_creatingList ? <ActivityIndicator color="black" /> : null
          }
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
    </Small_MODAL>
  );
}
