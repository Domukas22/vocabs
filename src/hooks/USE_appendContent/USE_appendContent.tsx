//
//
//

import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { SetStateAction, useCallback } from "react";

export function USE_appendContent<content_TYPE extends { id: string }>({
  current_ARR = [],
  SET_content = () => {},
  SET_printedIds = () => {},
  SET_loadingState = () => {},
  SET_hasReachedEnd = () => {},
  SET_unpaginatedCount = () => {},
}: {
  current_ARR: content_TYPE[];
  SET_content: (value: SetStateAction<content_TYPE[]>) => void;
  SET_printedIds: (value: SetStateAction<Set<string>>) => void;
  SET_loadingState: (value: SetStateAction<loadingState_TYPES>) => void;
  SET_hasReachedEnd: (value: SetStateAction<boolean>) => void;
  SET_unpaginatedCount: (value: SetStateAction<number>) => void;
}) {
  const APPEND_content = useCallback(
    (
      incoming_ARR: content_TYPE[],
      unpaginated_COUNT: number,
      loadMore: boolean
    ) => {
      if (loadMore) {
        const withNewlyAppendedContent_ARR: content_TYPE[] = [
          ...incoming_ARR,
          ...current_ARR,
        ];

        SET_content(withNewlyAppendedContent_ARR);
        SET_unpaginatedCount(unpaginated_COUNT);
        SET_printedIds(new Set(withNewlyAppendedContent_ARR.map((x) => x.id)));
        SET_hasReachedEnd(
          withNewlyAppendedContent_ARR.length >= unpaginated_COUNT
        );
      } else {
        SET_content(incoming_ARR);
        SET_unpaginatedCount(unpaginated_COUNT);
        SET_printedIds(new Set(incoming_ARR.map((x) => x.id)));
        SET_hasReachedEnd(incoming_ARR.length >= unpaginated_COUNT);
      }

      SET_loadingState("none");
    },
    [
      current_ARR,
      SET_content,
      SET_printedIds,
      SET_loadingState,
      SET_hasReachedEnd,
      SET_unpaginatedCount,
    ]
  );

  return { APPEND_content };
}
