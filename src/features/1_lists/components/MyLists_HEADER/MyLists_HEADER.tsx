//
//
//

import Btn from "@/src/components/Btn/Btn";
import Header from "@/src/components/Header/Header";
import { ICON_X } from "@/src/components/icons/icons";
import { useTranslation } from "react-i18next";

export default function MyLists_HEADER({ TOGGLE_createListModal }) {
  const { t } = useTranslation();
  return (
    <Header
      title={t("header.page_list")}
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
