//
//
//

import { useMemo } from "react";
import { ActivityIndicator } from "react-native";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { loadingState_TYPES } from "@/src/features/vocabs/functions/1_myVocabs/fetch/hooks/USE_myVocabs/USE_myVocabs";

export default function Flashlist_LABEL({
  debouncedSearch = "",
  appliedFiltersCount = 0,
  totalResult_COUNT = 0,
  target = "vocabs",
  loading_STATE = "none",
}: {
  debouncedSearch: string;
  appliedFiltersCount?: number;
  totalResult_COUNT: number;
  target: string;
  loading_STATE: loadingState_TYPES;
}) {
  const GET_label = () => {
    if (loading_STATE === "error") {
      // error case
      return "Something went wrong...";
    }

    if (loading_STATE === "searching") {
      return (
        // filtering only by debouncedSearch
        <Styled_TEXT>
          <ActivityIndicator color="gray" /> Searching...
        </Styled_TEXT>
      );
    }

    if (loading_STATE === "filtering") {
      if (!debouncedSearch) {
        return (
          // filtering only by filtering params
          <Styled_TEXT>
            <ActivityIndicator color="gray" /> Filtering...
          </Styled_TEXT>
        );
      }

      // filtering by debouncedSearch and filter params
      <Styled_TEXT>
        <ActivityIndicator color="gray" /> Searching and filtering...
      </Styled_TEXT>;
    }

    if (loading_STATE === "loading") {
      return (
        <Styled_TEXT>
          <ActivityIndicator color="gray" /> Loading{" "}
          <Styled_TEXT>{target}</Styled_TEXT>...
        </Styled_TEXT>
      );
    }

    if (loading_STATE === "none" || loading_STATE === "loading_more") {
      // no debouncedSearch or filters
      if (!debouncedSearch && !appliedFiltersCount) {
        return `Browse through ${
          totalResult_COUNT ? totalResult_COUNT : 0
        } ${target}`;
      }

      // debouncedSearch without filters
      if (debouncedSearch && !appliedFiltersCount) {
        return (
          <Styled_TEXT>
            {totalResult_COUNT} debouncedSearch results for
            <Styled_TEXT type="text_18_medium">
              {" "}
              '{debouncedSearch}'{" "}
            </Styled_TEXT>
          </Styled_TEXT>
        );
      }

      // filters without debouncedSearch
      if (!debouncedSearch && appliedFiltersCount) {
        return <Styled_TEXT>{totalResult_COUNT} Filtered results</Styled_TEXT>;
      }

      // debouncedSearch AND filters
      if (debouncedSearch && appliedFiltersCount) {
        return `${totalResult_COUNT} results, ${appliedFiltersCount} filters applied`;
      }
    }

    return `${totalResult_COUNT} results`;
  };

  return <Styled_TEXT type="label">{GET_label()}</Styled_TEXT>;
}
