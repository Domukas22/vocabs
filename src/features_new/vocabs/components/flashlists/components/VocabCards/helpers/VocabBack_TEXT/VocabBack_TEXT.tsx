//
//
//

import { View } from "react-native";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import React from "react";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { vocabFetch_TYPES } from "@/src/features_new/vocabs/functions/FETCH_vocabs/types";
import { itemVisibility_TYPE } from "@/src/types/general_TYPES";

const VocabBack_TEXT = React.memo(function VocabBack_TEXT({
  vocab,
  fetch_TYPE,
  list_TYPE,
}: {
  vocab: Vocab_TYPE;
  fetch_TYPE: vocabFetch_TYPES;
  list_TYPE: itemVisibility_TYPE;
}) {
  const ListName_COMP = React.memo(function ListName_COMP({
    list_NAME,
  }: {
    list_NAME: string;
  }) {
    return list_NAME ? (
      <Styled_TEXT type="label_small">List: {list_NAME}</Styled_TEXT>
    ) : null;
  });

  const Desk_COMP = React.memo(function Desk_COMP({
    description,
  }: {
    description: string;
  }) {
    return description ? (
      <Styled_TEXT type="label_small">{description}</Styled_TEXT>
    ) : null;
  });

  const Saved_COMP = React.memo(function Saved_COMP({
    saved_COUNT,
  }: {
    saved_COUNT: number;
  }) {
    return typeof saved_COUNT === "number" ? (
      <Styled_TEXT type="label_small">
        Saved {saved_COUNT} times by other users
      </Styled_TEXT>
    ) : null;
  });

  if (list_TYPE === "public") {
    if (fetch_TYPE === "all") {
      if (!vocab?.description && !vocab?.list?.name && !vocab?.saved_count)
        return null;

      return (
        <_Wrapper>
          <Desk_COMP description={vocab?.description} />
          <ListName_COMP list_NAME={vocab?.list?.name} />
          <Saved_COMP saved_COUNT={vocab?.saved_count} />
        </_Wrapper>
      );
    }

    if (fetch_TYPE === "byTargetList") {
      if (!vocab?.description && !vocab?.list?.name) return null;
      return (
        <_Wrapper>
          <Desk_COMP description={vocab?.description} />
          <Saved_COMP saved_COUNT={vocab?.saved_count} />
        </_Wrapper>
      );
    }
  }

  if (list_TYPE === "private") {
    if (fetch_TYPE === "byTargetList") {
      if (!vocab?.description) return null;
      return (
        <_Wrapper>
          <Desk_COMP description={vocab?.description} />
        </_Wrapper>
      );
    }
    if (fetch_TYPE === "all" || fetch_TYPE === "marked") {
      if (!vocab?.description && !vocab?.list?.name) return null;
      return (
        <_Wrapper>
          <Desk_COMP description={vocab?.description} />

          <ListName_COMP list_NAME={vocab?.list?.name} />
        </_Wrapper>
      );
    }

    if (fetch_TYPE === "deleted") {
      if (!vocab?.description) return null;
      return (
        <_Wrapper>
          <Desk_COMP description={vocab?.description} />
        </_Wrapper>
      );
    }
  }

  return null;
});

function _Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        padding: 12,
        borderBottomWidth: 1,
        borderColor: MyColors.border_white_005,
      }}
    >
      {children}
    </View>
  );
}

export default VocabBack_TEXT;
