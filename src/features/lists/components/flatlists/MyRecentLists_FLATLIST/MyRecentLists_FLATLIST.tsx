//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import { Skeleton_BLOCK } from "@/src/components/1_grouped/blocks/Skeleton_BLOCK";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_arrow2 } from "@/src/components/1_grouped/icons/icons";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { router } from "expo-router";
import React from "react";

import { z_USE_myStarterContent } from "@/src/hooks/zustand/z_USE_myStarterContent/z_USE_myStarterContent";
import { t } from "i18next";
import { ActivityIndicator } from "react-native";
import { MyColors } from "@/src/constants/MyColors";
import { USE_routerPush } from "@/src/hooks";
import { List_CARD } from "@/src/features_new/lists/components/flashlists/components/List_CARD/List_CARD";
import { z_USE_myOneList } from "@/src/features_new/lists/hooks/zustand/z_USE_myOneList/z_USE_myOneList";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { List_TYPE } from "@/src/features_new/lists/types";
import { starterContentLoading_TYPE } from "@/src/types/general_TYPES";

export function MyRecentLists_FLATLIST({
  top_LISTS = [],
  totalList_COUNT = 0,
  loading = "none",
}: {
  top_LISTS: List_TYPE[];
  totalList_COUNT: number;
  loading: starterContentLoading_TYPE;
}) {
  const { PUSH_router } = USE_routerPush();
  const { z_SET_myOneList } = z_USE_myOneList();

  if (loading === "initial")
    return (
      <Block styles={{ gap: 12 }}>
        <Label icon={<ActivityIndicator color={MyColors.icon_gray} />}>
          {t("label.loadingRecentLists")}
        </Label>
        <Skeleton_BLOCK height={80} />
        <Skeleton_BLOCK height={80} />
        <Skeleton_BLOCK height={80} />
      </Block>
    );

  return (
    <Block styles={{ gap: 12 }}>
      <Styled_TEXT type="title">{t("label.myLists")}</Styled_TEXT>
      {/* <Label>{t("label.recentLists")}</Label> */}
      {top_LISTS?.map((list) => (
        <List_CARD
          key={list.id}
          list={list}
          highlighted={false}
          onPress={() => {
            z_SET_myOneList(list);
            router.push(`/(main)/vocabs/${list.id}`);
          }}
        />
      ))}

      <Btn
        // text={`See all ${z_myStarterTotalListCount} lists`}
        text={`${t("btn.seeAllMyLists_PRE")} ${totalList_COUNT} ${t(
          "btn.seeAllMyLists_POST"
        )}`}
        iconRight={<ICON_arrow2 direction="right" />}
        text_STYLES={{ flex: 1 }}
        onPress={() => PUSH_router("my-lists")}
      />
    </Block>
  );
}
