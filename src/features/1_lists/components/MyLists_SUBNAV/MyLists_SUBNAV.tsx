//
//
//

import SearchBar from "@/src/components/SearchBar/SearchBar";
import Subnav from "@/src/components/Subnav/Subnav";

export default function MyLists_SUBNAV({ search, SET_search }) {
  return (
    <Subnav>
      <SearchBar value={search} SET_value={SET_search} />
    </Subnav>
  );
}
