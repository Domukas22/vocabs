//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import SearchBar from "@/src/components/1_grouped/inputs/SearchBar/SearchBar";
import { useEffect } from "react";
import { TextInput } from "react-native";

export function NavOpenSearch_BTNS({
  search = "",
  search_REF,
  SET_search = () => {},
  CLOSE_search = () => {},
}: {
  search: string;
  search_REF: React.RefObject<TextInput>;
  SET_search: (value: string) => void;
  CLOSE_search: () => void;
}) {
  useEffect(() => search_REF?.current?.focus(), []);

  return (
    <>
      <SearchBar _ref={search_REF} value={search} SET_value={SET_search} />
      <Btn
        text="Cancel"
        onPress={() => {
          CLOSE_search();
          SET_search("");
        }}
      />
    </>
  );
}
