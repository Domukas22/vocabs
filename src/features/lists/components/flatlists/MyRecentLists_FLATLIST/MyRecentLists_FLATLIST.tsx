//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import { Skeleton_BLOCK } from "@/src/components/1_grouped/blocks/Skeleton_BLOCK";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_arrow } from "@/src/components/1_grouped/icons/icons";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { router } from "expo-router";
import React from "react";
import { MyList_BTN } from "../../buttons/MyList_BTN/MyList_BTN";
import List_MODEL from "@/src/db/models/List_MODEL";

export const MyRecentLists_FLATLIST = function RecentlyUsedPrivateLists_LIST({
  lists = [],
  totalList_COUNT = 0,
  onPress = () => {},
}: {
  lists: List_MODEL[] | undefined;
  totalList_COUNT: number | undefined;
  onPress: () => void;
}) {
  return (
    <Block styles={{ gap: 12 }}>
      <Label>My recent lists</Label>
      {lists ? (
        lists?.map((list) => (
          <MyList_BTN
            {...{ list }}
            key={list.id}
            onPress={() => router.push(`/(main)/vocabs/${list.id}`)}
          />
        ))
      ) : (
        <>
          <Skeleton_BLOCK />
          <Skeleton_BLOCK />
          <Skeleton_BLOCK />
        </>
      )}
      <Btn
        text={`See all ${totalList_COUNT} lists`}
        iconRight={<ICON_arrow direction="right" />}
        text_STYLES={{ flex: 1 }}
        onPress={onPress}
      />
    </Block>
  );
};
