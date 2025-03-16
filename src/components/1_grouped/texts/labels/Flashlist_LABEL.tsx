//
//
//

import React, { useMemo } from "react";
import { ActivityIndicator } from "react-native";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { The4Fetch_TYPES, loadingState_TYPES } from "@/src/types/general_TYPES";
import { t } from "i18next";

interface FlashlistLabel_PROPS {
  IS_debouncing: boolean;
  debouncedSearch: string;
  search: string;
  appliedFiltersCount?: number;
  totalResult_COUNT: number;
  loading_STATE: loadingState_TYPES;
  type: The4Fetch_TYPES;
}

export default function Flashlist_LABEL({
  debouncedSearch = "",
  search = "",
  appliedFiltersCount = 0,
  totalResult_COUNT = 0,
  loading_STATE = "none",
  IS_debouncing = false,
  type,
}: FlashlistLabel_PROPS) {
  const target = useMemo(
    () => (type === "my-lists" || type === "public-lists" ? "lists" : "vocabs"),
    [type]
  );

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
          return `${totalResult_COUNT} ${t(
            "label.searchResultCount"
          )} '${debouncedSearch}'`;
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
