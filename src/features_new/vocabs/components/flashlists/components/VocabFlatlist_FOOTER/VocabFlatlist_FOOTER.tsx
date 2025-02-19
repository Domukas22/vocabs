//
//
//

import BottomAction_BLOCK from "@/src/components/1_grouped/blocks/BottomAction_BLOCK";
import Error_BLOCK from "@/src/components/1_grouped/blocks/Error_BLOCK";
import { General_ERROR } from "@/src/types/error_TYPES";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { VocabsSkeleton_BLOCK } from "../VocabsSkeleton_BLOCK/VocabsSkeleton_BLOCK";

export function VocabFlatlist_FOOTER({
  error = undefined,
  IS_debouncing = false,
  HAS_reachedEnd = false,
  z_myVocabsLoading_STATE = "none",
  unpaginated_COUNT = 0,
  debouncedSearch = "",
  LOAD_more = () => Promise.resolve(),
  RESET_search = () => {},
  OPEN_createVocabModal = () => {},
}: {
  error?: General_ERROR;
  IS_debouncing: boolean;
  HAS_reachedEnd: boolean;
  z_myVocabsLoading_STATE: loadingState_TYPES;
  unpaginated_COUNT: number;
  debouncedSearch: string;
  LOAD_more: () => Promise<void>;
  RESET_search: () => void;
  OPEN_createVocabModal?: () => void;
}) {
  return error ? (
    <Error_BLOCK paragraph={error?.user_MSG || "Something went wrong"} />
  ) : IS_debouncing ||
    (z_myVocabsLoading_STATE !== "none" &&
      z_myVocabsLoading_STATE !== "loading_more") ? (
    <VocabsSkeleton_BLOCK />
  ) : (
    <BottomAction_BLOCK
      type="vocabs"
      createBtn_ACTION={OPEN_createVocabModal}
      LOAD_more={LOAD_more}
      RESET_search={RESET_search}
      totalFilteredResults_COUNT={unpaginated_COUNT}
      debouncedSearch={debouncedSearch}
      z_myVocabsLoading_STATE={z_myVocabsLoading_STATE}
      HAS_reachedEnd={HAS_reachedEnd}
      IS_debouncing={IS_debouncing}
    />
  );
}
