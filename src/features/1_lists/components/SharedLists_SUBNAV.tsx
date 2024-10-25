//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_displaySettings, ICON_X } from "@/src/components/icons/icons";
import SearchBar from "@/src/components/SearchBar/SearchBar";
import Subnav from "@/src/components/Subnav/Subnav";
import USE_zustand, { z_listDisplaySettings_PROPS } from "@/src/zustand";
import { useMemo } from "react";
import USE_getActiveFilterCount from "../../2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/utils/USE_getActiveFilterCount";
import { ActivityIndicator } from "react-native";
import { MyColors } from "@/src/constants/MyColors";

export default function SharedLists_SUBNAV({
  search,
  SET_search,
}: {
  search: string;
  SET_search: (val: string) => void;
}) {
  return (
    <Subnav>
      <SearchBar value={search} SET_value={SET_search} />
    </Subnav>
  );
}
