//
//
//

import Btn from "@/src/components/Btn/Btn";
import Header from "@/src/components/Header/Header";
import { ICON_X } from "@/src/components/icons/icons";
import { List_PROPS } from "@/src/db/props";
import { useTranslation } from "react-i18next";

export default function MyLists_HEADER({
  TOGGLE_createListModal,
  lists,
}: {
  TOGGLE_createListModal: () => void;
  lists: List_PROPS[];
}) {
  const { t } = useTranslation();
  return (
    <Header
      title={`${t("header.page_list")} (${lists?.length || 0})`}
      big={true}
      btnRight={
        <Btn
          type="seethrough_primary"
          iconLeft={<ICON_X color="primary" big={true} />}
          onPress={TOGGLE_createListModal}
          style={{ borderRadius: 100 }}
        />
      }
    />
  );
}
