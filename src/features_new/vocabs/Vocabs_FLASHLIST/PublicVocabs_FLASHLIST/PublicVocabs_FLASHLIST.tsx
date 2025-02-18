//
//
//

import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";
import {
  USE_zustand,
  USE_getMyListName,
  USE_getPublicListName,
} from "@/src/hooks";
import { USE_toast } from "@/src/hooks/USE_toast/USE_toast";
import { USE_vocabZustandActions } from "@/src/features_new/vocabs/hooks/USE_vocabZustandActions/USE_vocabZustandActions";
import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useRef } from "react";
import { VocabsFlatlistHeader_SECTION } from "../../../../features/vocabs/components";
import { USE_openVocabs } from "../../../../features/vocabs/vocabList/USE_openVocabs/USE_openVocabs";
import { Vocab_CARD } from "../../../../features/vocabs/vocabList/Vocabs_LIST/helpers";
import * as Haptics from "expo-haptics";
import {
  myVocabFetch_TYPES,
  list_TYPES,
} from "../../functions/fetch/FETCH_vocabs/types";
import { VocabFlatlistFooter_SECTION } from "../helpers";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { USE_listIdInParams } from "../../../../features/vocabs/vocabList/USE_listIdInParams/USE_listIdInParams";
import { raw_Vocab_TYPE } from "../../../../features/vocabs/types";
import { z_USE_publicVocabs } from "../helpers/hooks/z_USE_publicVocabs/z_USE_publicVocabs";

export default function PublicVocabs_FLASHLIST({
  IS_debouncing = false,
  search = "",
  debouncedSearch = "",
  list_TYPE,
  fetch_TYPE,
  RESET_search = () => {},
  handleScroll = () => {},
}: {
  IS_debouncing: boolean;
  search: string;
  debouncedSearch: string;
  list_TYPE: list_TYPES;
  fetch_TYPE: myVocabFetch_TYPES;
  OPEN_createVocabModal?: () => void;
  OPEN_updateVocabModal?: (vocab: raw_Vocab_TYPE) => void;
  RESET_search: () => void;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}) {
  const { urlParamsList_ID } = USE_listIdInParams();
  const list_REF = useRef<FlashList<any>>(null);

  const { openVocab_IDs, TOGGLE_vocab } = USE_openVocabs();
  const { z_user, z_vocabDisplay_SETTINGS } = USE_zustand();
  const { difficultyFilters, langFilters, sortDirection, sorting } =
    z_vocabDisplay_SETTINGS;

  const {
    z_publicVocabs,
    z_HAVE_publicVocabsReachedEnd,
    z_publicVocabsUnpaginated_COUNT,
    z_publicVocabsLoading_STATE,
    z_publicVocabsCurrent_ACTIONS,
    z_publicVocabs_ERROR: error,
    z_FETCH_publicVocabs,
  } = z_USE_publicVocabs();

  const { list_NAME } = USE_getPublicListName();

  const { FETCH_vocabs } = USE_vocabZustandActions({
    user_id: z_user?.id || "",
    targetList_ID: urlParamsList_ID,
    list_TYPE,
    fetch_TYPE,

    search: debouncedSearch,
    difficultyFilters,
    langFilters,

    sortDirection,
    sorting,
    FETCH_v: z_FETCH_publicVocabs,
  });

  // Refetch on search / soritng / filter / list_id change
  useEffect(() => {
    (async () => await FETCH_vocabs())();
  }, [
    debouncedSearch,
    difficultyFilters,
    langFilters,
    sortDirection,
    sorting,
    urlParamsList_ID,
  ]);

  return (
    <Styled_FLASHLIST
      onScroll={handleScroll}
      data={
        IS_debouncing ||
        !!error ||
        (z_publicVocabsLoading_STATE !== "none" &&
          z_publicVocabsLoading_STATE !== "error" &&
          z_publicVocabsLoading_STATE !== "loading_more")
          ? []
          : z_publicVocabs || []
      }
      flashlist_REF={list_REF}
      renderItem={({ item }) => (
        <Vocab_CARD
          vocab={item}
          list_TYPE={list_TYPE}
          fetch_TYPE={fetch_TYPE}
          IS_open={openVocab_IDs.has(item?.id)} // This will now reflect the updated Set reference
          TOGGLE_open={(val?: boolean) => TOGGLE_vocab(item.id, val)}
          current_ACTIONS={z_publicVocabsCurrent_ACTIONS?.filter(
            (action) => action.vocab_ID === item?.id
          )}
        />
      )}
      keyExtractor={(item) => "Vocab" + item.id}
      extraData={[
        openVocab_IDs,
        z_publicVocabsCurrent_ACTIONS,
        // UPDATE_difficulty,
      ]}
      ListHeaderComponent={
        <VocabsFlatlistHeader_SECTION
          IS_debouncing={IS_debouncing}
          debouncedSearch={debouncedSearch}
          search={search}
          z_myVocabsLoading_STATE={z_publicVocabsLoading_STATE}
          list_NAME={list_NAME}
          unpaginated_COUNT={z_publicVocabsUnpaginated_COUNT}
          HAS_error={!!error}
        />
      }
      ListFooterComponent={
        <VocabFlatlistFooter_SECTION
          LOAD_more={() => FETCH_vocabs(true)}
          RESET_search={RESET_search}
          unpaginated_COUNT={z_publicVocabsUnpaginated_COUNT}
          HAS_reachedEnd={z_HAVE_publicVocabsReachedEnd}
          z_myVocabsLoading_STATE={z_publicVocabsLoading_STATE}
          {...{
            IS_debouncing,
            debouncedSearch,
            error,
          }}
        />
      }
    />
  );
}
