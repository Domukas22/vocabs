//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_download } from "@/src/components/1_grouped/icons/icons";
import { z_USE_myTargetSaveList } from "@/src/features_new/lists/hooks/zustand/z_USE_myTargetSaveList/z_USE_myTargetSaveList";
import { z_USE_publicOneList } from "@/src/features_new/lists/hooks/zustand/z_USE_publicOneList/z_USE_publicOneList";

export function NavSavePublicList_BTN({
  OPEN_saveListModal = () => {},
}: {
  OPEN_saveListModal: () => void;
}) {
  const { z_publicOneList } = z_USE_publicOneList();
  const { z_SET_myTargetSaveList } = z_USE_myTargetSaveList();

  return (
    <Btn
      onPress={() => {
        // TODO ==> figure out how to solve this
        if (!z_publicOneList) return;
        z_SET_myTargetSaveList(z_publicOneList);
        OPEN_saveListModal();
      }}
      type="action"
      iconLeft={<ICON_download />}
      style={{ flex: 1 }}
    />
  );
}
