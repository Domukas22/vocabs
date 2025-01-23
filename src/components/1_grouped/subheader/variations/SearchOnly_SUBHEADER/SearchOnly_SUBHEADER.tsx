//
//
//

import SearchBar from "@/src/components/1_grouped/inputs/SearchBar/SearchBar";
import Subheader from "../../Subheader";
import { useTranslation } from "react-i18next";
import React from "react";

interface SearchAndSelectSubnav_PROPS {
  search: string;
  SET_search: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchOnly_SUBHEADER({
  search = "",
  SET_search = () => {},
}: SearchAndSelectSubnav_PROPS) {
  const { t } = useTranslation();
  return (
    <Subheader>
      <SearchBar value={search} SET_value={SET_search} />
    </Subheader>
  );
}
