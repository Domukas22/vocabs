//
//
//

import { View } from "react-native";
import SearchBar from "../SearchBar/SearchBar";
import Btn from "../Btn/Btn";
import { Styled_TEXT } from "../Styled_TEXT/Styled_TEXT";
import Subnav from "../Subnav/Subnav";
import { useTranslation } from "react-i18next";
import React from "react";

interface SearchAndSelectSubnav_PROPS {
  search: string;
  SET_search: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchOnly_SUBNAV({
  search = "",
  SET_search = () => {},
}: SearchAndSelectSubnav_PROPS) {
  const { t } = useTranslation();
  return (
    <Subnav>
      <SearchBar value={search} SET_value={SET_search} />
    </Subnav>
  );
}
