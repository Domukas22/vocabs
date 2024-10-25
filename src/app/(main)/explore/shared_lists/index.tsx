//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import React from "react";
import SharedLists_HEADER from "@/src/features/1_lists/components/SharedLists_HEADER";
import SharedList_FLATLIST from "@/src/features/1_lists/components/SharedList_FLATLIST";
import USE_fetchSharedSupabaseLists from "@/src/features/2_vocabs/hooks/USE_fetchSharedSupabaseLists";
import USE_debounceSearch from "@/src/hooks/USE_debounceSearch/USE_debounceSearch";
import USE_zustand from "@/src/zustand";
import AllSharedListsBottom_SECTION from "@/src/features/1_lists/components/AllSharedListsBottom_SECTION";
import SharedLists_SUBNAV from "@/src/features/1_lists/components/SharedLists_SUBNAV";

export default function SharedLists_PAGE() {
  const { user } = USE_auth();
  const { search, debouncedSearch, SET_search } = USE_debounceSearch();
  const { z_listDisplay_SETTINGS } = USE_zustand();

  const {
    sharedLists,
    ARE_listsFetching,
    sharedLists_ERROR,
    LOAD_more,
    IS_loadingMore,
    HAS_reachedEnd,
  } = USE_fetchSharedSupabaseLists({
    search: debouncedSearch,
    z_listDisplay_SETTINGS,
    user_id: user?.id,
    paginateBy: 2,
  });

  return (
    <Page_WRAP>
      <SharedLists_HEADER />

      <SharedLists_SUBNAV {...{ search, SET_search }} />

      <SharedList_FLATLIST
        lists={sharedLists}
        bottom_SECTION={
          <AllSharedListsBottom_SECTION
            {...{
              IS_loadingMore,
              HAS_reachedEnd,
              ARE_listsFetching,
              LOAD_more,
            }}
          />
        }
      />
    </Page_WRAP>
  );
}
