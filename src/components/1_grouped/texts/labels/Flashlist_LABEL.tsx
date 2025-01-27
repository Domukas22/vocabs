//
//
//

import React, { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { loadingState_TYPES } from "@/src/features/vocabs/functions/1_myVocabs/fetch/hooks/USE_myVocabs/USE_myVocabs";

export default function Flashlist_LABEL({
  debouncedSearch = "",
  search = "",
  appliedFiltersCount = 0,
  totalResult_COUNT = 0,
  target = "vocabs",
  loading_STATE = "none",
  IS_debouncing = false,
}: {
  IS_debouncing: boolean;
  debouncedSearch: string;
  search: string;
  appliedFiltersCount?: number;
  totalResult_COUNT: number;
  target: string;
  loading_STATE: loadingState_TYPES;
}) {
  useEffect(() => {
    if (IS_debouncing) console.log("debouncing");
  }, [IS_debouncing]);

  const GET_label = () => {
    if (IS_debouncing) {
      if (search && appliedFiltersCount) {
        return (
          <>
            <ActivityIndicator color="gray" /> Searching and filtering...
          </>
        );
      }
      if (search && !appliedFiltersCount) {
        return (
          <>
            <ActivityIndicator color="gray" /> Searching...
          </>
        );
      }
      if (!search && appliedFiltersCount) {
        return (
          <>
            <ActivityIndicator color="gray" /> Filtering...
          </>
        );
      }
      // if (!search && !appliedFiltersCount) {
      //   return (
      //     <>
      //       <ActivityIndicator color="gray" /> Loading {target}...
      //     </>
      //   );
      // }
    }

    switch (loading_STATE) {
      case "error":
        return "Something went wrong...";

      case "searching":
        return (
          <>
            <ActivityIndicator color="gray" /> Searching...
          </>
        );

      case "filtering":
        return (
          <>
            <ActivityIndicator color="gray" /> Filtering...
          </>
        );

      case "searching_and_filtering":
        return (
          <>
            <ActivityIndicator color="gray" /> Searching and filtering...
          </>
        );

      case "loading":
        return (
          <>
            <ActivityIndicator color="gray" /> Loading {target}...
          </>
        );

      case "none":
      case "loading_more":
        if (!debouncedSearch && !appliedFiltersCount) {
          return `Browse through ${totalResult_COUNT || 0} ${target}`;
        }
        if (debouncedSearch && !appliedFiltersCount) {
          return `${totalResult_COUNT} search results for '${debouncedSearch}'`;
        }
        if (!debouncedSearch && appliedFiltersCount) {
          return `${totalResult_COUNT} filtered results`;
        }
        if (debouncedSearch && appliedFiltersCount) {
          return `${totalResult_COUNT} results for '${debouncedSearch}' with ${appliedFiltersCount} filters applied`;
        }
        break;

      default:
        return `${totalResult_COUNT} results`;
    }
  };

  return <Styled_TEXT type="label">{GET_label()}</Styled_TEXT>;
}
