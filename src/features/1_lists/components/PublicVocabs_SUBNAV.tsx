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

export default function PublicVocabs_SUBNAV({
  search,
  SET_search,
  TOGGLE_displaySettings,
}: {
  search: string;
  SET_search: (val: string) => void;
  TOGGLE_displaySettings: () => void;
}) {
  const { z_display_SETTINGS } = USE_zustand();
  const activeFilter_COUNT = USE_getActiveFilterCount(z_display_SETTINGS);

  return (
    <Subnav>
      <SearchBar value={search} SET_value={SET_search} />
      <Btn
        type="simple"
        iconLeft={<ICON_displaySettings />}
        style={{ borderRadius: 100 }}
        onPress={TOGGLE_displaySettings}
        topRightIconCount={activeFilter_COUNT}
      />
    </Subnav>
  );
}
