//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_download } from "@/src/components/1_grouped/icons/icons";

export function NavSavePublicList_BTN({
  OPEN_saveListModal = () => {},
}: {
  OPEN_saveListModal: () => void;
}) {
  return (
    <Btn
      onPress={OPEN_saveListModal}
      type="action"
      iconLeft={<ICON_download />}
      style={{ flex: 1 }}
    />
  );
}
