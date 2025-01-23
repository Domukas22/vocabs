//
//
//

import { useMemo } from "react";
import { ActivityIndicator } from "react-native";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";

export default function Flashlist_LABEL({
  IS_searching = false,
  search = "",
  HAS_error = false,
  appliedFiltersCount = 0,
  totalResult_COUNT = 0,
  target = "vocabs",
}: {
  IS_searching: boolean;
  HAS_error: boolean;
  search: string;
  appliedFiltersCount?: number;
  totalResult_COUNT: number;
  target: string;
}) {
  const label = useMemo(
    () =>
      HAS_error
        ? "error"
        : IS_searching
        ? "searching"
        : search !== ""
        ? "search_results"
        : appliedFiltersCount > 0
        ? "filters_applied"
        : "default",
    [HAS_error, IS_searching, search, appliedFiltersCount]
  );
  const GET_label = () => {
    let res;
    switch (label) {
      case "error":
        res = "Something went wrong";
        break;
      case "searching":
        res = (
          <Styled_TEXT>
            <ActivityIndicator color="gray" /> Searching...
          </Styled_TEXT>
        );
        break;
      case "search_results":
        res = (
          <Styled_TEXT>
            {totalResult_COUNT} Search results for
            <Styled_TEXT type="text_18_medium"> '{search}' </Styled_TEXT>
          </Styled_TEXT>
        );
        break;
      case "filters_applied":
        res = `${totalResult_COUNT} results, ${appliedFiltersCount} filters applied`;
        break;
      default:
        res = `Browse through ${
          totalResult_COUNT ? totalResult_COUNT : 0
        } ${target}`;
    }

    return res;
  };

  return <Styled_TEXT type="label">{GET_label()}</Styled_TEXT>;
}
