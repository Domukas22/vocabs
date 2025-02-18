//
//
//

import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";
import { USE_zustand, USE_getMyListName } from "@/src/hooks";
import { USE_toast } from "@/src/hooks/USE_toast/USE_toast";
import { USE_vocabZustandActions } from "@/src/features_new/vocabs/hooks/USE_vocabZustandActions/USE_vocabZustandActions";
import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useRef } from "react";
import { VocabsFlatlistHeader_SECTION } from "../../../../../features/vocabs/components";
import { USE_openVocabs } from "../../../../../features/vocabs/vocabList/USE_openVocabs/USE_openVocabs";
import { Vocab_CARD } from "../../../../../features/vocabs/vocabList/Vocabs_LIST/helpers";
import * as Haptics from "expo-haptics";
import { myVocabFetch_TYPES } from "../../../functions/fetch/FETCH_vocabs/types";

import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { USE_listIdInParams } from "../../../../../features/vocabs/vocabList/USE_listIdInParams/USE_listIdInParams";
import { list_TYPES } from "@/src/features_new/lists/types";
import { z_USE_myVocabs } from "../../../hooks/z_USE_myVocabs/z_USE_myVocabs";
import { raw_Vocab_TYPE } from "../../../types";
import { VocabFlatlistFooter_SECTION } from "../components/VocabFlatlistFooter_SECTION/VocabFlatlistFooter_SECTION";

export default function MyVocabs_FLASHLIST({
  IS_debouncing = false,
  search = "",
  debouncedSearch = "",
  list_NAME = "",
  list_TYPE,
  fetch_TYPE,
  OPEN_createVocabModal = () => {},
  OPEN_updateVocabModal = () => {},
  RESET_search = () => {},
  handleScroll = () => {},
}: {
  IS_debouncing: boolean;
  search: string;
  list_NAME: string;
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

  const { TOAST } = USE_toast();
  const { openVocab_IDs, TOGGLE_vocab } = USE_openVocabs();

  const { z_user, z_vocabDisplay_SETTINGS } = USE_zustand();
  const { difficultyFilters, langFilters, sortDirection, sorting } =
    z_vocabDisplay_SETTINGS;

  const {
    z_myVocabs,
    z_HAVE_myVocabsReachedEnd,
    z_myVocabsUnpaginated_COUNT,
    z_myVocabsLoading_STATE,
    z_myVocabsCurrent_ACTIONS,
    z_myVocabs_ERROR: error,
    z_myVocabsHighlighted_ID,
    z_FETCH_myVocabs,
    z_MARK_myVocab,
    z_UPDATE_myVocabDifficulty,
    z_SOFTDELETE_myVocab,
    z_HARDDELETE_myVocab,
    z_SET_myTargetVocab,
  } = z_USE_myVocabs();

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
    FETCH_v: z_FETCH_myVocabs,
  });

  // Refetch on search / sorting / filter / list_id change
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
        error ||
        (z_myVocabsLoading_STATE !== "none" &&
          z_myVocabsLoading_STATE !== "error" &&
          z_myVocabsLoading_STATE !== "loading_more")
          ? []
          : z_myVocabs || []
      }
      flashlist_REF={list_REF}
      renderItem={({ item }: { item: raw_Vocab_TYPE }) => (
        <Vocab_CARD
          vocab={item}
          list_TYPE={list_TYPE}
          fetch_TYPE={fetch_TYPE}
          UPDATE_vocabDifficulty={async (
            vocab_ID: string,
            current_DIFFICULTY: number,
            new_DIFFICULTY: 1 | 2 | 3,
            CLOSE_editBtns: () => void
          ) => {
            await z_UPDATE_myVocabDifficulty(
              vocab_ID,
              current_DIFFICULTY,
              new_DIFFICULTY,
              {
                onSuccess: () => {
                  TOAST("success", "Difficulty updated", "bottom"),
                    CLOSE_editBtns();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                },
                onFailure: (err) =>
                  TOAST("error", err.user_MSG, "bottom", 10000),
              }
            );
          }}
          UPDATE_vocabMarked={(vocab_ID: string, val: boolean) =>
            z_MARK_myVocab(vocab_ID, val, {
              onSuccess: () => {
                TOAST(
                  "success",
                  val ? "Vocab marked" : "Vocab unmarked",
                  "bottom"
                );

                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
              },
              onFailure: (err) => TOAST("error", err.user_MSG, "bottom", 10000),
            })
          }
          SOFTDELETE_vocab={(vocab_ID: string) =>
            z_SOFTDELETE_myVocab(vocab_ID, {
              onSuccess: () => {
                TOAST("success", "Vocab deleted", "bottom");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
              },
              onFailure: (err) => TOAST("error", err.user_MSG, "bottom", 10000),
            })
          }
          HARDDELETE_vocab={(vocab_ID: string) =>
            z_HARDDELETE_myVocab(vocab_ID, {
              onSuccess: () => {
                TOAST("success", "Vocab deleted forever", "bottom");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
              },
              onFailure: (err) => TOAST("error", err.user_MSG, "bottom", 10000),
            })
          }
          OPEN_updateVocabModal={(vocab: raw_Vocab_TYPE) => {
            z_SET_myTargetVocab(vocab);
            OPEN_updateVocabModal(vocab);
          }}
          highlighted={z_myVocabsHighlighted_ID === item.id}
          IS_open={openVocab_IDs.has(item?.id)} // This will now reflect the updated Set reference
          TOGGLE_open={(val?: boolean) => TOGGLE_vocab(item.id, val)}
          current_ACTIONS={z_myVocabsCurrent_ACTIONS?.filter(
            (action) => action.vocab_ID === item?.id
          )}
        />
      )}
      keyExtractor={(item) => "Vocab" + item.id}
      extraData={[
        z_myVocabsHighlighted_ID,
        openVocab_IDs,
        z_myVocabsCurrent_ACTIONS,
        // UPDATE_difficulty,
      ]}
      ListHeaderComponent={
        <VocabsFlatlistHeader_SECTION
          IS_debouncing={IS_debouncing}
          debouncedSearch={debouncedSearch}
          search={search}
          z_myVocabsLoading_STATE={z_myVocabsLoading_STATE}
          list_NAME={list_NAME}
          unpaginated_COUNT={z_myVocabsUnpaginated_COUNT}
          HAS_error={!!error}
        />
      }
      ListFooterComponent={
        <VocabFlatlistFooter_SECTION
          LOAD_more={() => FETCH_vocabs(true)}
          OPEN_createVocabModal={OPEN_createVocabModal}
          RESET_search={RESET_search}
          unpaginated_COUNT={z_myVocabsUnpaginated_COUNT}
          HAS_reachedEnd={z_HAVE_myVocabsReachedEnd}
          {...{
            IS_debouncing,
            z_myVocabsLoading_STATE,
            debouncedSearch,

            error,
          }}
        />
      }
    />
  );
}
