//
//
//
//

import React from "react";
import Big_BTN from "@/src/components/1_grouped/buttons/Big_BTN/Big_BTN";

import { ListCard_BOTTOM } from "./helpers";
import { List_TYPE } from "@/src/features_new/lists/types";
import { ListCard_TOP } from "./helpers/ListCard_TOP/ListCard_TOP";

export const List_CARD = React.memo(function List_CARD({
  list,
  highlighted = false,
  onPress,
}: {
  list: List_TYPE;
  highlighted?: boolean;
  onPress: () => void;
}) {
  return (
    <Big_BTN {...{ onPress, highlighted }}>
      <ListCard_TOP list={list} />
      <ListCard_BOTTOM list={list} />
    </Big_BTN>
  );
});
