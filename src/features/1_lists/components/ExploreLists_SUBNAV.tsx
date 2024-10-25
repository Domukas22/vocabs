//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_displaySettings, ICON_X } from "@/src/components/icons/icons";
import SearchBar from "@/src/components/SearchBar/SearchBar";
import Subnav from "@/src/components/Subnav/Subnav";
import USE_zustand from "@/src/zustand";
import { useMemo } from "react";
import USE_getActiveFilterCount from "../../2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/utils/USE_getActiveFilterCount";
import { ActivityIndicator } from "react-native";
import { MyColors } from "@/src/constants/MyColors";

export default function ExploreLists_SUBNAV({
  search,
  ARE_langIdsCollecting,
  SET_search,
  TOGGLE_displaySettings,
}: {
  search: string;
  ARE_langIdsCollecting: boolean;
  SET_search: (val: string) => void;
  TOGGLE_displaySettings: () => void;
}) {
  const { z_listDisplay_SETTINGS } = USE_zustand();
  const activeFilter_COUNT = USE_getActiveFilterCount(z_listDisplay_SETTINGS);

  return (
    <Subnav>
      <SearchBar value={search} SET_value={SET_search} />
      <Btn
        type="simple"
        iconLeft={
          ARE_langIdsCollecting ? (
            <ActivityIndicator color={MyColors.icon_gray} />
          ) : (
            <ICON_displaySettings />
          )
        }
        style={{ borderRadius: 100 }}
        onPress={() => {
          if (!ARE_langIdsCollecting) TOGGLE_displaySettings();
        }}
        topRightIconCount={activeFilter_COUNT}
      />
    </Subnav>
  );
}
